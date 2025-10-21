import { ErrorHandlerService } from '@frankjhub/shared-error-handler';
import { env } from '../config/env';
import { logger } from '../infrastructure/logger';

const errorHandlerService = new ErrorHandlerService(env, logger);

export const errorHandler = errorHandlerService.getMiddleware();
