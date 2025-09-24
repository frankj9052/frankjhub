import { ErrorDetails } from '@frankjhub/shared-schema';
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';
export class RedisConnectionError extends BaseError {
  constructor(details?: ErrorDetails) {
    super({
      code: 'REDIS_CONNECTION_ERROR',
      status: StatusCodes.SERVICE_UNAVAILABLE, // 503 表示服务暂时不可用
      message: 'Failed to connect to the redis',
      details,
    });
  }
}
