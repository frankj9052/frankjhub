// NotAuthorizedError 这个不是标准的HTTP错误名
// 这里我们用Forbidden

import { ErrorDetails } from '@frankjhub/shared-schema';
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class ForbiddenError extends BaseError {
  constructor(reason?: string, details?: ErrorDetails) {
    const extraDetails = typeof details === 'object' && details !== null ? details : undefined;

    super({
      code: 'FORBIDDEN',
      status: StatusCodes.FORBIDDEN, // 403: 已认证，但禁止访问
      message: reason ? `Access forbidden: ${reason}` : 'Access forbidden',
      details: extraDetails,
    });
  }
}
