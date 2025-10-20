import { RedisService } from '@frankjhub/shared-redis';
import { env } from '../config/env';
import { logger } from './logger';
const redisService = new RedisService(env, logger);

export const isRedisAvailable = redisService.getStatus().isAvailable;
export const redisClient = redisService.getClient();
export const connectRedis = redisService.connect.bind(redisService);
export const closeRedisConnection = redisService.close.bind(redisService);
