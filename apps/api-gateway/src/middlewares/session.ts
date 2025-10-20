import { SessionService } from '@frankjhub/shared-session';
import { env } from '../config/env';
import { redisClient } from '../infrastructure/redis';
import { logger } from '../infrastructure/logger';

const sessionService = new SessionService(env, logger, redisClient);
export const sessionMiddleware = sessionService.getMiddleware();
