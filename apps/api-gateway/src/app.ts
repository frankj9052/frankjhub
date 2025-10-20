import express from 'express';
import { requestId } from './middlewares/requestId';
import { securityHeaders } from './middlewares/securityHeaders';
import { corsOptions, corsPreflight } from './middlewares/cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { sessionMiddleware } from './middlewares/session';
import { rateLimiterGlobal } from './infrastructure/rateLimiter';

export async function createApp() {
  const app = express();

  // Redis速率限制
  app.use(rateLimiterGlobal);

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

  return app;
}
