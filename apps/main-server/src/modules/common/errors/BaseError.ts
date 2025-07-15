import { BaseErrorResponse, ErrorDetails } from '@frankjhub/shared-schema';
import { StatusCodes } from 'http-status-codes';

/**
 * 构造 BaseError 时可传入的字段定义
 */
export interface ErrorOptions {
  code: string; // 业务唯一 error-code
  status?: number; // HTTP 状态码，默认 500
  message: string; // 对外的错误信息（可支持 i18n）
  details?: ErrorDetails; // 附加调试信息（如 zod 报错详情）
  cause?: unknown; // 原始异常（支持 ES2022 Error cause）
}

/**
 * 可附加 requestId（用于链路追踪）
 */
interface WithRequestId {
  requestId?: string;
}

/**
 * 系统统一错误类，所有自定义错误需继承该类
 */
export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details: ErrorDetails | undefined;
  public readonly isOperational = true;
  public readonly timestamp = new Date().toISOString();

  constructor({
    code,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    message,
    details,
    cause,
  }: ErrorOptions) {
    super(message, { cause });
    this.code = code;
    this.status = status;
    this.details = details;
    this.cause = cause;

    // 修复继承链：确保 instanceof 检测生效
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * 安全序列化错误内容，防止 JSON.stringify 崩溃
   */
  toJSON(): BaseErrorResponse {
    const { requestId } = this as this & WithRequestId;

    // 处理 cause 字段（避免循环引用或不可序列化结构）
    let serializedCause: string | undefined;
    if (this.cause instanceof Error) {
      serializedCause = this.cause.message;
    } else if (typeof this.cause === 'object') {
      try {
        serializedCause = JSON.stringify(this.cause);
      } catch {
        serializedCause = '[Unserializable object]';
      }
    } else if (typeof this.cause !== 'undefined') {
      serializedCause = String(this.cause);
    }

    return {
      timestamp: this.timestamp,
      status: this.status,
      code: this.code,
      message: this.message,
      requestId,
      details: this.details,
      ...(serializedCause && { cause: serializedCause }),
    };
  }
}
