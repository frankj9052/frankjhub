// 动态匹配 + 反向代理
// 代理路由（避免 bodyParser，使用原始流）
import { NextFunction, Request, Response, Router } from 'express';
// import { checkScopes, verifyAccess } from './authz';
import { createProxyMiddleware, fixRequestBody, RequestHandler } from 'http-proxy-middleware';
import { RouteMatchResult } from '@frankjhub/shared-schema';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { getMatch } from './registry.client';
import { BaseError, NotFoundError } from '@frankjhub/shared-errors';
import { createLoggerWithContext } from '../infrastructure/logger';
import { HttpHeaders, StripHeaders } from '@frankjhub/shared-constants';

export const gatewayRawRouter = Router();

const logger = createLoggerWithContext('gatewayRawRouter');

const proxyCache = new Map<string, RequestHandler<IncomingMessage, ServerResponse>>();

const getOrCreateProxy = (m: RouteMatchResult) => {
  const key = `${m.target}||${m.rewrite || ''}`;
  const cached = proxyCache.get(key);
  if (cached) return cached;

  const proxy = createProxyMiddleware({
    target: m.target,
    changeOrigin: true,
    ws: true,
    xfwd: true, // // 由 http-proxy-middleware 注入 x-forwarded-* 族
    proxyTimeout: 25_000,
    timeout: 25_000,
    preserveHeaderKeyCase: true, // // 避免上游对大小写敏感问题
    pathRewrite: m.rewrite ? { [m.rewrite]: '' } : undefined,
    selfHandleResponse: false, // 让中间件自行完成响应
    on: {
      proxyReq: (proxyReq, req: IncomingMessage, _res: ServerResponse) => {
        const eReq = req as unknown as Request;
        // 在代理中剥离敏感头
        for (const header of StripHeaders) {
          proxyReq.removeHeader(header);
        }

        // —— 统一主体（principal）传递：service / user / anonymous ——
        const isUser = !!eReq?.headers?.cookie;
        const isService = eReq?.headers?.authorization;

        const principalType = isService ? 'service' : isUser ? 'user' : 'anonymous';

        proxyReq.setHeader(HttpHeaders.PRINCIPAL_TYPE, principalType);

        // 透传 service token info
        if (isService && (req as any).serviceAuth) {
          const serviceAuth = (req as any).serviceAuth;
          proxyReq.setHeader(HttpHeaders.FORWARDED_SERVICE, serviceAuth.serviceId || '');
          if (Array.isArray(serviceAuth.scopes)) {
            proxyReq.setHeader(HttpHeaders.FORWARDED_SCOPES, serviceAuth.scopes.join(' '));
          }
        }

        // 手动透传cookie
        if (eReq.headers.cookie) {
          proxyReq.setHeader(HttpHeaders.COOKIE, eReq.headers.cookie);
        }

        // 透传/对齐请求 ID（与 requestId 中间件配合）
        const rid = eReq.requestId || '';
        if (rid) proxyReq.setHeader(HttpHeaders.REQUEST_ID, rid);

        // 附加标识头（便于上游审计）
        proxyReq.setHeader(HttpHeaders.GATEWAY, 'api-gateway');

        // 某些场景（如 application/json+签名）需要保持原始 body；一般 fixRequestBody 即可
        fixRequestBody(proxyReq, eReq);

        const urlForLog = (eReq as any).originalUrl || eReq.url || '';
        logger.debug(`[GW] -> ${m.target}${urlForLog} rid=${rid}`);
      },

      proxyRes: (proxyRes, req: IncomingMessage, res: ServerResponse) => {
        // 将上游的 x-request-id 回写给客户端（若存在）
        const upstreamRid = proxyRes.headers[HttpHeaders.REQUEST_ID] as string | undefined;
        if (upstreamRid) res.setHeader(HttpHeaders.REQUEST_ID, upstreamRid);

        const method = (req as any).method || '';
        const urlForLog = (req as any).originalUrl || (req as any).url || '';
        logger.info(`[GW] <- ${proxyRes.statusCode} ${method} ${urlForLog}`);
      },

      error: (err, req: IncomingMessage, res: ServerResponse | Socket) => {
        const eReq = req as unknown as Request;
        const rid = eReq.requestId || '';
        logger.error('[GW] proxy error', { err, rid });
        if (res instanceof ServerResponse) {
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader(HttpHeaders.CONTENT_TYPE, 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'bad_gateway', detail: err.message, requestId: rid }));
          } else {
            // headers 已发送，尽量终止
            try {
              res.end();
            } catch {
              logger.debug('[GW] response already closed', { rid });
            }
          }
        } else {
          // WebSocket/upgrade：销毁底层套接字
          try {
            res.destroy();
          } catch {
            logger.debug('[GW] socket already closed', { rid });
          }
        }
      },
    },
  });
  proxyCache.set(key, proxy);
  return proxy;
};

// —— 主入口：注册到 gatewayRawRouter.use(...) ——
gatewayRawRouter.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const match = getMatch(req);
    if (!match) return res.status(404).json(new NotFoundError('Route not found'));

    // —— 公开 / 受保护判定（空 scopes = 公开）——
    // const isPublic = match.requiredScopes.length === 0;
    // const hasServiceToken = !!req.headers.authorization;

    // 公开路由：可匿名；但如带凭证则需要校验（避免“带了但无效”的灰区）
    // if (isPublic) {
    //   if (hasServiceToken) {
    //     await verifyAccess(req, match.audience);
    //   }
    // } else {
    //   // 受保护：必须鉴权 + scope
    //   await verifyAccess(req, match.audience);
    //   checkScopes(req, match.requiredScopes);
    // }

    // —— 客户端断开兜底：避免上游还在处理 ——
    let aborted = false;
    req.on('aborted', () => {
      aborted = true;
      logger.warn('[GW] client aborted');
    });
    if (aborted) {
      return; // 直接结束
    }

    // —— 获取/创建上游代理并转发 ——
    const proxy = getOrCreateProxy(match);

    return proxy(req, res, next);
  } catch (error: any) {
    if (error instanceof BaseError) {
      logger.warn('[GW] access rejected', error);
      return res.status(error.status).json(error.toJSON());
    } else {
      const code = 401;
      const rid = req.requestId;
      logger.warn('[GW] access rejected', { error, rid });
      return res
        .status(code)
        .type('application/json; charset=utf-8')
        .json({
          error: error?.code || 'unauthorized',
          message: error?.message || 'Unauthorized',
          required: error?.required,
          requestId: rid,
        });
    }
  }
});
