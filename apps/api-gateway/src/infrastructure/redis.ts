import { RedisService } from '@frankjhub/shared-redis';
import { env } from '../config/env';
import { logger } from './logger';
import Redis from 'ioredis';
const redisService = new RedisService(env, logger);
export const redisSubscriberService = new RedisService(
  env,
  logger.child({ context: 'redisSubscriber' })
);

export const isRedisAvailable = redisService.getStatus().isAvailable;
export const redisClient: Redis = redisService.getClient();
export const connectRedis = redisService.connect.bind(redisService);
export const closeRedisConnection = redisService.close.bind(redisService);

export const redisSubscriber: Redis = redisSubscriberService.getClient();
