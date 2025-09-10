import { hostBelongsToDomain, parseCookieDomain } from '@frankjhub/shared-utils';
import session from 'express-session';
import { env } from './env';
import { buildSessionOptions } from './sessionOptions';
import { NextFunction, Request, Response } from 'express';

type SessionEntry = {
  domain: string;
  middleware: ReturnType<typeof session>;
};

export function createSessionByHost() {
  const domains = parseCookieDomain(env.SESSION_COOKIE_DOMAIN);
  if (domains.length === 0) {
    // 未配置：全部走 host-only（更安全的默认）
    const hostOnly = session(buildSessionOptions({ cookieDomain: undefined }));
    return function sessionByHost(req: Request, res: Response, next: NextFunction) {
      return hostOnly(req, res, next);
    };
  }

  // 为每个域族创建一个 session 中间件（可共用同一个 Redis store）
  const entries: SessionEntry[] = domains.map(d => ({
    domain: d,
    middleware: session(buildSessionOptions({ cookieDomain: d })),
  }));

  // 回落：host-only（适配临时域名/预览环境/IP/localhost）
  const fallbackHostOnly = session(buildSessionOptions({ cookieDomain: undefined }));

  // 运行时分发
  return function sessionByHost(req: Request, res: Response, next: NextFunction) {
    const host = String(req.hostname || '')
      .toLowerCase()
      .replace(/:\d+$/, '');
    // 优先匹配具体域族
    for (const { domain, middleware } of entries) {
      if (hostBelongsToDomain(host, domain)) {
        // 测试打印
        // console.debug(`[session] ${host} -> domain ${domain} (${getRegistrableHint(host)})`);
        return middleware(req, res, next);
      }
    }
    // 未命中：host-only
    // console.debug(`[session] ${host} -> host-only`);
    return fallbackHostOnly(req, res, next);
  };
}
