import { Logger } from 'winston';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { EnvBase, UserPayload } from '@frankjhub/shared-schema';
import {
  findAggregateError,
  flattenAggregateErrors,
  isNetLike,
} from '@frankjhub/shared-error-utils';
import { SessionData } from 'express-session';
import { BaseError, InternalServerError, UnauthorizedError } from '@frankjhub/shared-errors';
import * as Sentry from '@sentry/node';

// 类型辅助接口：用于安全访问动态扩展属性
interface WithRequestId {
  requestId?: string;
  session?: SessionData;
  currentUser?: UserPayload;
}

/**
 * ErrorHandlerService
 * - 提供 Express 全局错误处理中间件
 * - 支持日志记录、Sentry 上报、requestId 注入、session 清理
 */
export class ErrorHandlerService<T extends EnvBase> {
  private env: T;
  private logger: Logger;

  constructor(env: T, logger: Logger) {
    this.env = env;
    this.logger = logger;
  }

  /**
   * 返回可直接挂载在 Express 的中间件函数
   */
  getMiddleware(): ErrorRequestHandler {
    // 第四个参数绝对不能删，express会不认这个error handler中间件
    return (err: Error, req: Request & WithRequestId, res: Response, _next: NextFunction) => {
      const logger = this.logger.child({
        context: 'ErrorHandlerService',
        requestId: (req as any)?.requestId ?? 'unknown',
      });

      // 1. 统一错误封装（非 BaseError 的错误将转为 InternalServerError）
      const baseError: BaseError =
        err instanceof BaseError
          ? err
          : new InternalServerError(
              this.env.NODE_ENV === 'development' ? err.stack : undefined,
              err
            );
      // 2. 注入 requestId（便于日志和链路追踪）
      const appError: BaseError & WithRequestId = Object.assign(baseError, {
        requestId: req.requestId,
      });

      // 展开AggregateError
      const agg =
        findAggregateError(err) ||
        findAggregateError(appError) ||
        findAggregateError(appError.cause as any);
      const inner = agg ? flattenAggregateErrors(agg) : undefined;

      // 网络错误码识别：如果是网络类错误，服务端以 503 返回（覆写 BaseError.status）
      const netLike = isNetLike(err as any, inner);
      const status = netLike ? 503 : appError.status;

      // 3. 自动清理会话：如果是 UnauthorizedError 则销毁 session（防止滥用）
      if (appError instanceof UnauthorizedError && req?.session) {
        req.session.destroy(() => {
          logger.debug('Session destroyed due to unauthorized access');
        });
      }

      // 4. 日志输出（结构化）
      logger.error('Unhandled application error', {
        name: appError.name,
        message: appError.message,
        requestId: req.requestId,
        stack: appError.stack,
        status,
        code: appError.code,
        cause:
          appError.cause instanceof Error
            ? { name: appError.cause.name, message: appError.cause.message }
            : appError.cause ?? undefined,
        path: req.path,
        method: req.method,
        user: req.currentUser?.id,
        aggregate: agg ? { count: inner?.length ?? 0, inner } : undefined,
      });

      // 5. Sentry 报错（仅限严重错误 && 生产环境）
      if (this.env.NODE_ENV === 'production' && appError.status >= 500) {
        Sentry.captureException(err, {
          tags: {
            requestId: req.requestId,
            path: req.path,
            userId: req.currentUser?.id,
            netLike: String(netLike),
          },
          extra: {
            status,
            appErrorCode: appError.code,
            stack: appError.stack,
            userAgent: req.headers['user-agent'],
            session: req.session,
            aggregateInner: inner,
          },
        });
      }

      // 客户端响应：保持统一 JSON；dev 环境可返回 aggregate 便于调试
      const payload = {
        ...appError.toJSON(),
        status, // 覆盖成最终决定的 HTTP 状态
        ...(this.env.NODE_ENV === 'development' && inner ? { aggregate: inner } : {}),
      };

      // 6. 客户端响应（安全的 JSON 输出，使用统一的 toJSON）
      res.status(appError.status).json(payload);
    };
  }
}
