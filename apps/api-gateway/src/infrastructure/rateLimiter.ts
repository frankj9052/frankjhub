import { RateLimiterService, RateLimiterStrategies } from '@frankjhub/shared-rate-limiter';
import { redisClient } from './redis';

const rateLimiterService = new RateLimiterService(redisClient);

export const rateLimiterGlobal = rateLimiterService.createLimiter(RateLimiterStrategies.global);
