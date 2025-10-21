import { createLoggerWithContext } from './infrastructure/logger';
import { closeRedisConnection, connectRedis, redisClient } from './infrastructure/redis';
import { createApp } from './app';
import { Server } from 'http';
import { env } from './config/env';
import * as Sentry from '@sentry/node';

let server: Server;
const serverLogger = createLoggerWithContext('Api-Gateway Server');
let isShuttingDown = false;

async function startServer() {
  {
    try {
      serverLogger.info('🚀 Starting server...');

      // 初始化 Redis
      await connectRedis();

      // 创建并配置 Express 应用
      const app = await createApp();

      // 启动 HTTP 服务器
      server = app.listen(Number(env.PORT), () => {
        serverLogger.info(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
      });

      /* -------- 全局异常与信号处理(once避免重复触发) -------- */
      process.once('unhandledRejection', error => {
        serverLogger.error('❗ Unhandled Rejection:', error);
        Sentry.captureException(error);
        shutdown(1);
      });

      process.on('uncaughtException', error => {
        serverLogger.error('❗ Uncaught Exception:', error);
        Sentry.captureException(error);
        shutdown(1);
      });

      process.on('SIGINT', () => {
        serverLogger.warn('📴 Received SIGINT');
        shutdown(0);
      });

      process.on('SIGTERM', () => {
        serverLogger.warn('📴 Received SIGTERM');
        shutdown(0);
      });
    } catch (error) {
      serverLogger.error('❌ Server failed to start', error);
      process.exit(1);
    }
  }
}

/** 优雅关闭 */
async function shutdown(exitCode: number) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  serverLogger.info('🧹 Shutting down server...');

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
      serverLogger.info('🛑 HTTP server closed.');
    }
    if (redisClient) {
      await closeRedisConnection();
    }
  } catch (error) {
    serverLogger.error('❗ Error during shutdown:', error);
  } finally {
    process.exit(exitCode);
  }
}

startServer();
