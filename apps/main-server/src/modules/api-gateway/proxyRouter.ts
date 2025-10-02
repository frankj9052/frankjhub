// 动态匹配 + 反向代理
// 代理路由（避免 bodyParser，使用原始流）

import { Router } from 'express';
import { getMatch } from './registrySnapshot.client';
import { NotFoundError } from '../common/errors/NotFoundError';
import { checkScopes, verifyAccess } from './authz';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createLoggerWithContext } from '../common/libs/logger';

export const gatewayRawRouter = Router();

const logger = createLoggerWithContext('gatewayRawRouter');
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
gatewayRawRouter.use(async (req, res, next) => {
  try {
    const match = getMatch(req);

    if (!match) return res.status(404).json(new NotFoundError('Route not found'));
    await verifyAccess(req, match.audience);

    checkScopes(req, match.requiredScopes);

    const proxy = createProxyMiddleware({
      target: match.target,
      changeOrigin: true,
      ws: true,
      proxyTimeout: 25_000,
      timeout: 25_000,
      pathRewrite: match.rewrite ? { [match.rewrite]: '' } : undefined,
      on: {
        proxyReq: (proxyReq, req, _res) => {
          // 先删掉潜在的用户伪造
          proxyReq.removeHeader('x-forwarded-service');
          proxyReq.removeHeader('x-request-id');

          proxyReq.setHeader(
            'x-forwarded-service',
            (req as any).serviceAuth?.serviceId || (req as any).serviceAuth?.sub || ''
          );
          proxyReq.setHeader('x-request-id', String(req.headers['x-request-id'] || ''));
          logger.debug(`[GW] proxying to: ${match.target}, path=${req.url}`);
        },
        proxyRes: (proxyRes, req, _res) => {
          // 记录上游状态，确认确实到了上游
          logger.info(
            `[GW] upstream status: ${proxyRes.statusCode} for ${(req as any).originalUrl}`
          );
          // 关键：让 proxy 明确处理响应（避免 Express 继续向后）
          // 默认情况下已处理，但我们显式确保不会 next()
          // 不需要手写 selfHandleResponse=true + res.end 手动复制流，
          // 只要不调用 next()，http-proxy-middleware 就会结束响应的。
        },
        error: (err, _req, res) => {
          (res as any).statusCode = 502;
          res.end(JSON.stringify({ error: 'bad_gateway', detail: err.message }));
        },
      },
    });

    return proxy(req, res, next);
  } catch (error: any) {
    const code = error?.status || 401;
    return res
      .status(code)
      .json({ error: error.message || 'unauthorized', required: error.required });
  }
});
