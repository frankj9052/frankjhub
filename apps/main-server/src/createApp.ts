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
  app.use(cookieParser()); // 给 session 用
  app.use(requestId); // 让上游能拿到 x-request-id
  app.use(corsOptions);
  app.options('*', corsPreflight);
  app.use(securityHeaders);

  // 认证态相关
  app.use(sessionMiddleware);
  app.use(currentUser);

  // 挂载网关
  // const { gatewayRawRouter } = await import('./modules/api-gateway/proxyRouter.js');
  // 给网关挂载需要的轻中间件
  // app.use('/gw', requestId, sessionMiddleware, currentUser, gatewayRawRouter);

  // body解析放网关后面
  app.use(
    express.json({
      verify: rawBodyOption,
    })
  );
  app.use(express.urlencoded({ extended: true, verify: rawBodyOption }));

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
