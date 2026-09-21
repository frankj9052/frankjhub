import { setDefaultResultOrder } from 'node:dns';
setDefaultResultOrder('ipv4first');
import 'express-async-errors';
import { createApp } from './createApp';
import { createLoggerWithContext, logger } from './modules/common/libs/logger';
import { env } from './config/env';
import { Server } from 'http';
import { connectDatabase } from './infrastructure/database';
import AppDataSource from './config/data-source';
import { closeRedisConnection, connectRedis, redisClient } from './infrastructure/redis';
import * as Sentry from '@sentry/node';
import { registerAllJobs } from './jobs';
import { EmailModule, initEmailModule } from './modules/email/email.module';

const jobRunners: Array<{ close: () => Promise<void> }> = []; // 保存所有 runner 以便关闭
let server: Server;
let isShuttingDown = false;
let emailModule: EmailModule | undefined;

const serverLogger = createLoggerWithContext('Server');

/** 服务启动入口（所有异步 await 都集中在这里） */
async function startServer() {
  try {
    serverLogger.info('🚀 Starting server...');

    // 1. 初始化数据库（含种子）
    await connectDatabase({
      dataSource: AppDataSource,
      enableSeeders: env.ENABLE_SEEDERS === 'true',
      skipCreateDatabase: true,
    });

    // 2. 初始化 Redis
    await connectRedis();

    // 2.5 注册 BullMQ 计划任务
    if (redisClient) {
      const runners = await registerAllJobs(redisClient);
      jobRunners.push(...runners);
      serverLogger.info(`🗓️ Registered ${runners.length} job runner(s).`);
    }

    // 2.8 初始化邮件模块
    emailModule = await initEmailModule({ ds: AppDataSource, redis: redisClient });
    if (env.EMAIL_ENABLE_QUEUE === 'true') {
      await emailModule.startWorker();
    }

    // 3. 创建并配置 Express 应用
    const app = await createApp();

    // 4. 启动 HTTP 服务器
    server = app.listen(Number(env.PORT), env.BIND_HOST, () => {
      serverLogger.info(`🚀 Server running at http://${env.HOST}:${env.PORT}`);
      serverLogger.info(`📚 Swagger docs available at http://${env.HOST}:${env.PORT}/api-docs`);
      // 在 server 启动成功后再启动快照定时器
      // import('./modules/api-gateway/registrySnapshot.client.js')
      //   .then(({ startSnapshotScheduler }) => {
      //     startSnapshotScheduler();
      //     serverLogger.info('📸 Registry snapshot scheduler started.');
      //   })
      //   .catch(err => {
      //     serverLogger.error('Failed to start snapshot scheduler', err);
      //   });
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
      logger.warn('📴 Received SIGINT');
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
    // 停 Email Worker（先停 Worker，再关 Redis）
    if (emailModule) {
      await emailModule
        .stopWorker()
        .catch(err => serverLogger.error('Error stopping Email Worker', err));
      serverLogger.info('🛑 Email worker stopped.');
    }
    // 关闭 BullMQ（先关 worker/queue，再断开 redis）
    if (jobRunners.length) {
      await Promise.allSettled(jobRunners.map(r => r.close()));
      serverLogger.info('🛑 Job runners closed.');
    }
    if (redisClient) {
      await closeRedisConnection();
    }
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      serverLogger.info('🛑 Database connection closed.');
    }
  } catch (error) {
    serverLogger.error('❗ Error during shutdown:', error);
  } finally {
    process.exit(exitCode);
  }
}

startServer();
