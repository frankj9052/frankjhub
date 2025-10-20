import { ErrorDetails } from '@frankjhub/shared-schema';
import { BaseError } from './BaseError';
import { StatusCodes } from 'http-status-codes';

export class TooManyRequestsError extends BaseError {
  constructor(message = 'Too many requests. Please try again later.', details?: ErrorDetails) {
    super({
      code: 'TOO_MANY_REQUESTS',
      status: StatusCodes.TOO_MANY_REQUESTS, // 429
      message,
      details,
    });
  }
}
