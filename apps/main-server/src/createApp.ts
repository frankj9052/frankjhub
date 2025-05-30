import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/corsOptions';
import { registerRoutes } from './loaders/registerRoutes';

export async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // ---- 全局中间件 ----
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- 动态注册业务路由（异步操作）----
  const apiRouter = Router();
  await registerRoutes(apiRouter);
  app.use('/api', apiRouter);

  return app;
}
