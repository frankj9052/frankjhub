import { StatusCodes } from 'http-status-codes';
import { BaseError } from './BaseError';

export class TooManyRequestsError extends BaseError {
  constructor(message = 'Too many requests. Please try again later.', details?: unknown) {
    super({
      code: 'TOO_MANY_REQUESTS',
      status: StatusCodes.TOO_MANY_REQUESTS, // 429
      message,
      details,
    });
  }
}
