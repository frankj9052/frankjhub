import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import { registerRoutes } from './loaders/registerRoutes';
import { requestId } from './middlewares/requestId';
import { errorHandler } from './middlewares/errorHandler';
import { generateSwaggerDocs } from './swagger/swagger';
import { sessionMiddleware } from './middlewares/sessionMiddleware';

export async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // ---- 全局中间件 ----
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 其它中间件
  app.use(requestId);
  app.use(sessionMiddleware);

  // ---- 动态注册业务路由（异步操作）----
  const apiRouter = Router();
  await registerRoutes(apiRouter);
  app.use('/api', apiRouter);

  // ---- Swagger ----
  generateSwaggerDocs(app);

  // ---- 全局错误处理器 ----
  app.use(errorHandler);
  return app;
}
