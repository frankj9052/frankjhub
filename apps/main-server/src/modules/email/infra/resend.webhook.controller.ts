import { EMAIL_RECEIPT_EVENT, EMAIL_STATUS, EmailStatus } from '@frankjhub/shared-schema';
import { DataSource } from 'typeorm';
import { EmailReceipt } from '../entities/EmailReceipt';
import { InvocationError } from '../../common/errors/InvocationError';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import AppDataSource from '../../../config/data-source';
import { env } from '../../../config/env';
import { verifyResendWebhook } from './verify-resend-webhook';
import { createLoggerWithContext } from '../../common/libs/logger';
import { ForbiddenError } from '../../common/errors/ForbiddenError';
import { InternalServerError } from '../../common/errors/InternalServerError';
import { EmailOutbox } from '../entities/EmailOutbox';

/**
 * 提取通用字段
 */
function extractProviderFields(payload: any) {
  const event: string | undefined = payload?.type || payload?.event || payload?.data?.event;

  const providerMessageId: string | undefined =
    payload?.data?.email_id ||
    payload?.data?.object?.id ||
    payload?.data?.message?.id ||
    payload?.object?.id ||
    payload?.message?.id ||
    payload?.id;

  // 可选：外部事件 id（若存在，用于更强幂等）
  const externalEventId: string | undefined =
    payload?.data?.id || payload?.event_id || payload?.data?.event_id;

  return { event, providerMessageId, externalEventId };
}

/**
 * 事件 -> EmailStatus 映射
 */
function mapEventToStatus(event: string): EmailStatus | undefined {
  const e = event.toLowerCase();
  if (e.includes('delivered')) return EMAIL_RECEIPT_EVENT.DELIVERED;
  if (e.includes('bounce')) return EMAIL_RECEIPT_EVENT.BOUNCED;
  if (e.includes('complain')) return EMAIL_RECEIPT_EVENT.COMPLAINED;
  if (e.includes('sent')) return EMAIL_RECEIPT_EVENT.SENT;
  return undefined;
}

/**
 * 幂等插入 EmailReceipt（依赖唯一索引）
 */
async function insertRceiptIdemotent(ds: DataSource, rec: Partial<EmailReceipt>) {
  const repo = ds.getRepository(EmailReceipt);
  try {
    const entity = repo.create(rec);
    await repo.save(entity);
    return true;
  } catch (error: any) {
    // 唯一键冲突：重复回执，忽略
    if (error?.code === '23505') {
      return false;
    }
    throw new InvocationError('insertRceiptIdemotent', error);
  }
}

/**
 * 主控制器
 * 注意：若你启用签名校验，需要在 app.ts 里为该路由使用 raw body 中间件，
 * 或在 verifyResendWebhook 内从 req（例如 req.rawBody）读取原始文本。
 */
export const resendWebhookController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ds = AppDataSource;
  const logger = createLoggerWithContext('resendWebhookController');
  try {
    const secret = env.RESEND_WEBHOOK_SECRET;
    if (secret) {
      const ok = verifyResendWebhook(req, secret);
      if (!ok) {
        logger.warn('Webhook signature verification failed');
        throw new ForbiddenError('Invalid signature');
      }
    }

    const raw = (req as any).rawBody ?? req.body; // raw 中间件挂过的 or Buffer
    const payload =
      typeof raw === 'string'
        ? JSON.parse(raw)
        : Buffer.isBuffer(raw)
        ? JSON.parse(raw.toString('utf8'))
        : req.body; // 兜底（万一上游不是 raw）
    const { event, providerMessageId } = extractProviderFields(payload);

    if (!event || !providerMessageId) {
      logger.warn('Missing event/providerMessageId in webhook payload', { payload });
      throw new InternalServerError('Invalid payload');
    }
    // 幂等地写入 EmailReceipt
    await insertRceiptIdemotent(ds, {
      providerMessageId,
      event,
      payload,
    });

    // 更新 outbox 状态
    const outboxRepo = ds.getRepository(EmailOutbox);
    const out = await outboxRepo.findOne({ where: { providerMessageId } });

    if (out) {
      const mapped = mapEventToStatus(event);
      if (mapped) {
        await outboxRepo.update(out.id, { status: mapped });
      }

      // 硬退回/投诉 -> 抑制
      if (mapped === EMAIL_STATUS.BOUNCED || mapped === EMAIL_STATUS.COMPLAINED) {
        // 直接执行 upsert（避免引入额外 repo）
        await ds.query(
          `INSERT INTO email_suppressions(email, reason)
           VALUES ($1,$2)
          ON CONFLICT (email) DO NOTHING
          `,
          [out?.to, mapped === EMAIL_STATUS.BOUNCED ? 'bounce' : 'complaint']
        );
      }
    } else {
      // 找不到对应 outbox，记录日志即可（可能历史数据/清理/或并发）
      logger.info('Outbox not found for providerMessageId', { providerMessageId, event });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
