import express from 'express';
import { requestId } from './middlewares/requestId';
import { securityHeaders } from './middlewares/securityHeaders';
import { corsOptions, corsPreflight } from './middlewares/cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { sessionMiddleware } from './middlewares/session';
import { rateLimiterGlobal } from './infrastructure/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { mountHealthRoutes } from './routes/health';
import { gatewayRawRouter } from './gateway/proxyRouter';
import { mountDebugRoutes } from './routes/debug';

export async function createApp() {
  const app = express();

  // 信任反代
  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // 轻中间件（不破坏body）
  app.use(requestId); // 让上游能拿到 x-request-id
  app.use(securityHeaders);
  app.use(corsOptions);
  app.use('*', corsPreflight);
  app.use(cookieParser());
  app.use(compression());

  // session
  app.use(sessionMiddleware);

  // 健康检查
  mountHealthRoutes(app);
  mountDebugRoutes(app);

  // Redis速率限制
  app.use(rateLimiterGlobal);

  // 网关代理
  app.use(gatewayRawRouter);

  // 全局错误处理器
  app.use(errorHandler);

  return app;
}
