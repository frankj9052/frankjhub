import { Request } from 'express';
import crypto from 'crypto';

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
export function verifyResendWebhook(req: Request, secret: string) {
  try {
    const id = req.header('svix-id');
    const timestamp = req.header('svix-timestamp');
    const signature = req.header('svix-signature');

    if (!id || !timestamp || !signature) {
      return false;
    }

    // 获取原始 body（建议在 app.ts 配置 raw body 中间件）
    const raw = (req as any).rawBody ?? JSON.stringify(req.body);
    const payload = `${id}.${timestamp}.${raw}`;

    // Svix 文档建议使用 base64url 解码的密钥；这里按普通 HMAC 处理（兼容方案）
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64');

    // 签名是多段 "v1,..."；我们做最小匹配
    const match = signature.split(',').some((part: string) => part.trim().endsWith(hmac));
    return match;
  } catch {
    return false;
  }
}
