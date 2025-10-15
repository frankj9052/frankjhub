import { Request } from 'express';
import crypto from 'crypto';
import { createLoggerWithContext } from '../../common/libs/logger';

const timingSafeEqBuf = (a: Buffer, b: Buffer) => {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

// 既支持 base64url 也支持标准 base64，自动补齐 padding
const b64AnyToBuf = (s: string): Buffer | null => {
  try {
    // 先把可能的 base64url 转为标准 base64
    let t = s.replace(/-/g, '+').replace(/_/g, '/');
    // 补齐 '=' 到长度为 4 的倍数
    const pad = t.length % 4;
    if (pad) t += '='.repeat(4 - pad);
    return Buffer.from(t, 'base64');
  } catch {
    return null;
  }
};
/**
 * Resend 通常通过 Svix 发送 Webhook，会带以下头：
 *   - svix-id
 *   - svix-timestamp
 *   - svix-signature
 * 我做了一个兼容层：如果没配 secret 或缺头，就返回 false。
 *
 * 注意：严格验证需要“原始请求体字符串”。若框架只提供 JSON 对象，
 * 请在 app.ts 针对该路由使用 raw body 中间件，把原始文本挂在 req.rawBody。
 * 想严格对齐 Svix 官方算法，可以引入 svix SDK；这里提供的是轻量兼容方案，足够本地/测试环境使用。生产强校验建议接入官方库。
 */
export function verifyResendWebhook(req: Request, secret: string, skewSec = 5 * 60) {
  const logger = createLoggerWithContext('verifyResendWebhook');
  try {
    const id = req.header('svix-id');
    const timestamp = req.header('svix-timestamp');
    const signature = req.header('svix-signature');

    if (!id || !timestamp || !signature) {
      logger.warn('missing svix headers');
      return false;
    }

    // 时间窗口
    const now = Math.floor(Date.now() / 1000);
    const tsNum = Number(timestamp);
    if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > skewSec) return false;

    // 1) 拿到原始 body（来自 express.raw 中间件）
    const rawBody =
      typeof (req as any).rawBody === 'string'
        ? (req as any).rawBody
        : Buffer.isBuffer((req as any).rawBody)
        ? (req as any).rawBody.toString('utf8')
        : '';
    if (!rawBody) {
      logger.warn('Empty rawBody');
      return false;
    }
    const payload = `${id}.${timestamp}.${rawBody}`;

    // secret：去掉 whsec_ 前缀，再 base64 解码成 key 字节
    const key = Buffer.from(String(secret).replace(/^whsec_/, ''), 'base64');

    if (!key.length) {
      logger.warn('Invalid secret');
      return false;
    }

    // 计算 HMAC，转 base64
    const expected = crypto.createHmac('sha256', key).update(payload).digest();

    // 解析 header：空格分隔的条目，每条形如 "v1,<sig>" 或 "v2,<sig>"
    const candidates = String(signature)
      .trim()
      .split(/\s+/) // 空格分隔多段
      .map(s => s.trim().split(/[,=]/)) // 支持 "v1,<sig>" 或 "v1=<sig>"
      .filter(([ver, sig]) => ver === 'v1' && !!sig)
      .map(([, sig]) => sig);

    if (candidates.length === 0) {
      logger.warn(`No v1 in signature. raw header: ${signature}`);
      return false;
    }

    // 把每个候选签名解码为 Buffer，再与 expected(字节) 恒时比较
    for (const c of candidates) {
      const candBuf = b64AnyToBuf(c);
      if (candBuf && timingSafeEqBuf(candBuf, expected)) {
        return true; // 命中
      }
    }

    // 便于调试：打印一个对比信息（不输出明文，只输出长度/样式）
    logger.warn(
      `No match. candidates=${candidates.length}, ` +
        `candLen=[${candidates.map(x => b64AnyToBuf(x)?.length ?? 0).join(',')}], ` +
        `expectedLen=${expected.length}`
    );
    return false;
  } catch (e) {
    logger.warn(`verify error: ${(e as Error).message}`);
    return false;
  }
}
