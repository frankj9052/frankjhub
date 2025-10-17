import { EnvBase } from '@frankjhub/shared-schema';
import winston from 'winston';
import * as Sentry from '@sentry/node';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import os from 'os';
import { ILoggerService } from './logger.type';

/**
 * 自定义日志元信息类型
 * - context: 日志上下文，例如模块名或功能名
 * - requestId: 请求 ID，用于链路追踪
 * - userId: 用户 ID，可选
 */
type CustomLogMeta = {
  context?: string;
  requestId?: string;
  userId?: string;
};

/**
 * LoggerService: 类型安全的 Winston + Sentry 日志服务
 * - 支持 Console / File / Sentry 三种 Transport
 * - 自动根据 NODE_ENV 调整日志等级和格式
 * - 支持创建带 context 或 request/user 信息的子 logger
 *
 * @template T Env 类型（必须继承 EnvBase）
 */
export class LoggerService<T extends EnvBase> implements ILoggerService {
  private logger: winston.Logger;
  private env: T;
  private logsDir: string;

  /**
   * 构造函数
   * @param env 环境变量对象（必须包含 NODE_ENV）
   * @param logsDir 日志文件存放路径，默认 process.cwd()/logs
   */
  constructor(env: T, logsDir?: string) {
    this.env = env;
    this.logsDir = logsDir ?? path.resolve(process.cwd(), 'logs');
    this.initSentry();
    this.logger = this.createLogger();
  }

  /**
   * 初始化 Sentry（仅生产环境 & 配置 DSN 时生效）
   * - tracesSampleRate = 0：不采样性能，只捕获错误
   * - release = `${APP_NAME}@${APP_VERSION}`：便于 Sentry 中版本追踪
   */
  private initSentry() {
    if (this.env.NODE_ENV === 'production' && this.env.SENTRY_DSN) {
      Sentry.init({
        dsn: this.env.SENTRY_DSN,
        tracesSampleRate: 0, // 如果需要 APM 请调高；这里只做 error 汇报
        release: `${this.env.APP_NAME ?? 'app'}@${this.env.APP_VERSION ?? 'dev'}`,
        enabled: true,
      });
    }
  }

  /**
   * 创建 Winston Logger 实例
   * - 根据环境自动选择 Console / File / Sentry Transport
   * - 支持彩色输出（开发）或 JSON 结构化输出（生产）
   */
  private createLogger(): winston.Logger {
    const LOG_LEVEL = this.env.LOG_LEVEL || (this.env.NODE_ENV === 'production' ? 'info' : 'debug');

    // Console Transport: 开发环境彩色可读，生产环境保持 JSON 结构化（方便 stdout 收集）
    const consoleTransport = new winston.transports.Console({
      level: LOG_LEVEL,
      handleExceptions: true,
      format:
        this.env.NODE_ENV === 'production'
          ? winston.format.combine(winston.format.timestamp(), winston.format.json())
          : winston.format.combine(
              winston.format.colorize({ all: true }),
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.printf(({ timestamp, level, message, stack, context, ...meta }) =>
                [
                  `${timestamp} [${level}]${context ? ` [${context}]` : ''}`,
                  stack ?? message,
                  Object.keys(meta).length ? JSON.stringify(meta) : '',
                ]
                  .filter(Boolean)
                  .join(' | ')
              )
            ),
    });

    // File Transport（仅本地或需要持久化日志时启用）
    const fileTransport =
      this.env.NODE_ENV === 'production' && this.env.LOG_TO_FILE !== 'true'
        ? null
        : new DailyRotateFile({
            dirname: this.logsDir,
            filename: '%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d',
            maxSize: '20m',
            zippedArchive: true,
            level: LOG_LEVEL,
            handleExceptions: true,
            handleRejections: true,
          });

    // Sentry Transport  （自定义；不产生多余输出）
    // - 对 error 级别以上事件做 captureException
    const sentryTransport =
      this.env.NODE_ENV === 'production' && this.env.SENTRY_DSN
        ? new winston.transports.Console({
            level: 'error',
            handleExceptions: true,
            format: winston.format(info => {
              // 1) 把 info 转成 Error 实例（保持堆栈）
              let err: Error;
              if (info instanceof Error) {
                err = info;
              } else if (info.stack && typeof info.stack === 'string') {
                // 手动创建 + 重新挂 stack，确保 TS 类型安全
                err = new Error(typeof info.message === 'string' ? info.message : 'Captured error');
                err.stack = info.stack;
              } else {
                err = new Error(
                  typeof info.message === 'string' ? info.message : JSON.stringify(info)
                );
              }

              // 2) 推送到 Sentry，带完整 extra
              Sentry.captureException(err, { extra: info });

              // 3) 返回 false ⇒ Winston 不再输出该条日志
              return false;
            })(),
          })
        : null;

    return winston.createLogger({
      level: LOG_LEVEL,
      defaultMeta: {
        service: this.env.APP_NAME ?? 'unknown-service',
        hostname: os.hostname(),
        pid: process.pid,
      },
      transports: [
        consoleTransport,
        ...(fileTransport ? [fileTransport] : []),
        ...(sentryTransport ? [sentryTransport] : []),
      ],
      exitOnError: false, // 优雅关机交由 process.on() 处理
    });
  }

  /**
   * 获取基础 logger 实例
   * @returns Winston Logger
   * @example
   * const logger = loggerService.getLogger();
   * logger.info('Hello world');
   */
  getLogger(): winston.Logger {
    return this.logger;
  }

  /**
   * 创建带 context 的子 logger
   * @param context 模块名或功能名
   * @returns Winston 子 logger
   * @example
   * const userLogger = loggerService.createLoggerWithContext('UserModule');
   * userLogger.info('User created');
   */
  createLoggerWithContext(context: string) {
    return this.logger.child({ context } as CustomLogMeta);
  }

  /**
   * 创建带 requestId / userId 的子 logger
   * - 用于请求链路追踪
   * @param requestId 请求唯一 ID
   * @param userId 用户 ID，可选
   * @returns Winston 子 logger
   * @example
   * const reqLogger = loggerService.getRequestLogger('req-123', 'user-456');
   * reqLogger.error('Something went wrong');
   */
  getRequestLogger(requestId: string, userId?: string) {
    return this.logger.child({ requestId, userId } as CustomLogMeta);
  }
}
