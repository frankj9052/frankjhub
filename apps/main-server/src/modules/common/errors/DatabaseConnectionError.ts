// DatabaseConnectionError.ts
import { ErrorDetails } from '@frankjhub/shared-schema';
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';
// throw new DatabaseConnectionError({ host: 'localhost', port: 5432 });
export class DatabaseConnectionError extends BaseError {
  constructor(details?: ErrorDetails) {
    super({
      code: 'DB_CONNECTION_ERROR',
      status: StatusCodes.SERVICE_UNAVAILABLE, // 503 表示服务暂时不可用
      message: 'Failed to connect to the database',
      details,
    });
  }
}
