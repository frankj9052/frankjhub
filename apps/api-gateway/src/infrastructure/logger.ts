import { LoggerService } from '@frankjhub/shared-logger';
import { env } from '../config/env';
import path from 'path';

const loggerService = new LoggerService(env, path.resolve(process.cwd(), 'logs'));
export const createLoggerWithContext = loggerService.createLoggerWithContext.bind(loggerService);
export const getRequestLogger = loggerService.getRequestLogger.bind(loggerService);
export const logger = loggerService.getLogger();
