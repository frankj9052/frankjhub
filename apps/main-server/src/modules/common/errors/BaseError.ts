import { StatusCodes } from 'http-status-codes';

export interface ErrorOptions {
  code: string; // 业务唯一 error-code
  status?: number; // HTTP 状态码
  message: string; // 对外的错误信息（可 i18n）
  details?: unknown; // 附加调试信息
  cause?: Error; // ES2022 原生 Error cause
}

interface WithRequestId {
  requestId?: string;
}

export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details: unknown;
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

    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    const { requestId } = this as this & WithRequestId;

    return {
      timestamp: this.timestamp,
      status: this.status,
      code: this.code,
      message: this.message,
      requestId,
    };
  }
}
