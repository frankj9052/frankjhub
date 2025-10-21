// 动态匹配 + 反向代理
// 代理路由（避免 bodyParser，使用原始流）
import { NextFunction, Request, Response, Router } from 'express';
import { checkScopes, verifyAccess } from './authz';
import { createProxyMiddleware, fixRequestBody, RequestHandler } from 'http-proxy-middleware';
import { RouteMatchResult } from '@frankjhub/shared-schema';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { getMatch } from './registry.client';
import { BaseError, NotFoundError } from '@frankjhub/shared-errors';
import { createLoggerWithContext } from '../infrastructure/logger';

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
        // —— 清理潜在伪造/跳跃头（安全基线）——
        const stripHeaders = [
          'x-forwarded-service',
          'x-forwarded-user',
          'x-forwarded-user-name',
          'x-forwarded-scopes',
          'x-principal-type',
          'x-request-id',
          'x-original-host',
          'x-original-url',
          'via',
          'forwarded',
          'te', // hop-by-hop
          'connection',
          'upgrade',
          'proxy-authorization',
          'proxy-authenticate',
          'transfer-encoding',
          'keep-alive',
          'trailer',
        ];
        stripHeaders.forEach(h => proxyReq.removeHeader(h));
        // —— 统一主体（principal）传递：service / user / anonymous ——
        // service（机器对机器）
        const serviceAuth = eReq.serviceAuth;
        // user（最终用户）
        // const currentUser = eReq.currentUser;
        const sessionUser = eReq.session?.user;

        const principalType = serviceAuth ? 'service' : sessionUser ? 'user' : 'anonymous';

        proxyReq.setHeader('x-principal-type', principalType);

        if (principalType === 'service') {
          proxyReq.setHeader('x-forwarded-service', serviceAuth?.serviceId || '');
          if (Array.isArray(serviceAuth?.scopes) && serviceAuth.scopes.length > 0) {
            proxyReq.setHeader('x-forwarded-scopes', serviceAuth.scopes.join(' '));
          }
        } else if (principalType === 'user') {
          const userId = sessionUser?.id;
          const userName = sessionUser?.userName;
          const permissions = sessionUser?.permissionStrings;
          proxyReq.setHeader('x-forwarded-user', userId ?? 'unknwon user');
          if (userName) proxyReq.setHeader('x-forwarded-user-name', userName);
          if (permissions && permissions.length > 0)
            proxyReq.setHeader('x-forwarded-scopes', permissions.join(' '));
        }

        // 透传/对齐请求 ID（与 requestId 中间件配合）
        const rid = eReq.requestId || '';
        if (rid) proxyReq.setHeader('x-request-id', rid);

        // 附加标识头（便于上游审计）
        proxyReq.setHeader('x-gateway', 'api-gateway');

        // 某些场景（如 application/json+签名）需要保持原始 body；一般 fixRequestBody 即可
        fixRequestBody(proxyReq, eReq);

        const urlForLog = (eReq as any).originalUrl || eReq.url || '';
        logger.debug(`[GW] -> ${m.target}${urlForLog} rid=${rid}`);
      },

      proxyRes: (proxyRes, req: IncomingMessage, res: ServerResponse) => {
        // 将上游的 x-request-id 回写给客户端（若存在）
        const upstreamRid = proxyRes.headers['x-request-id'] as string | undefined;
        if (upstreamRid) res.setHeader('x-request-id', upstreamRid);

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
            res.setHeader('content-type', 'application/json; charset=utf-8');
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
    const isPublic = match.requiredScopes.length === 0;
    // —— 是否带了任何可用的“凭证” ——
    const hasCreds =
      !!req.headers.authorization ||
      !!req.headers.cookie ||
      !!req.headers['x-api-key'] ||
      !!req.headers['x-service-token'] ||
      !!req?.session?.user;

    // 公开路由：可匿名；但如带凭证则需要校验（避免“带了但无效”的灰区）
    if (isPublic) {
      if (hasCreds) {
        await verifyAccess(req, match.audience);
      }
    } else {
      // 受保护：必须鉴权 + scope
      await verifyAccess(req, match.audience);
      checkScopes(req, match.requiredScopes);
    }

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

// 测试router
// 请求 GET http://localhost:3100/gw/__debug/match/booking/booking
// gatewayRawRouter.get('/__debug/match/*', (req, res) => {
//   const { getMatch } = require('./registrySnapshot.client');
//   const fake = { ...req, path: req.path.replace('/__debug/match', '') };
//   const match = getMatch(fake as any);
//   res.json({ path: req.path, stripped: (fake as any).path, match });
// });

// 2) 可选：打一条“进入网关”的日志，便于确认挂载生效
// gatewayRawRouter.use((req, _res, next) => {
//   logger.info(`[GW] inbound: method=${req.method} originalUrl=${req.originalUrl} path=${req.path}`);
//   next();
// });

// 注意：不要在此 router 上挂 json/urlencoded 解析（保持原始流）
// 依赖：http-proxy-middleware（安装到 main-server）
// 注意通配符*会吃掉req.path里的内容，去掉星号或者用req.url, req.restUrl
