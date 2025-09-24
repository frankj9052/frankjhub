import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import { corsOptions, corsPreflight } from './config/corsOptions';
import { registerRoutes } from './loaders/registerRoutes';
import { requestId } from './middlewares/requestId';
import { errorHandler } from './middlewares/errorHandler';
import { generateSwaggerDocs } from './swagger/swagger';
import { sessionMiddleware } from './middlewares/sessionMiddleware';
import { securityHeaders } from './middlewares/securityHeaders';
import { currentUser } from './middlewares/currentUser';
import { rawBodyOption } from './config/rawBodyOption';

export async function createApp() {
  const app = express();

  app.set('trust proxy', true);
  app.disable('x-powered-by');

  // ---- 全局中间件 ----
  app.use(cookieParser());
  app.use(corsOptions);
  app.options('*', corsPreflight);
  app.use(securityHeaders);
  app.use(
    express.json({
      verify: rawBodyOption,
    })
  );
  app.use(express.urlencoded({ extended: true, verify: rawBodyOption }));

  // 其它中间件
  app.use(requestId);
  app.use(sessionMiddleware);
  app.use(currentUser);

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
