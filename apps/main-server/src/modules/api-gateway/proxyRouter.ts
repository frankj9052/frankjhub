// 动态匹配 + 反向代理
// 代理路由（避免 bodyParser，使用原始流）

import { Router } from 'express';
import { getMatch } from './registrySnapshot.client';
import { NotFoundError } from '../common/errors/NotFoundError';
import { checkScopes, verifyAccess } from './authz';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const gatewayRawRouter = Router();

// 注意：不要在此 router 上挂 json/urlencoded 解析（保持原始流）
// 依赖：http-proxy-middleware（安装到 main-server）
gatewayRawRouter.use('*', async (req, res, next) => {
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
          proxyReq.setHeader(
            'x-forwarded-service',
            (req as any).serviceAuth?.serviceId || (req as any).serviceAuth?.sub || ''
          );
          proxyReq.setHeader('x-request-id', String(req.headers['x-request-id'] || ''));
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
