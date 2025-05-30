import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import type { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../../infrastructure/redis';
import { TooManyRequestsError } from '../errors/TooManyRequestsError';

interface LimiterOptions {
  points: number;
  duration: number;
  blockDuration?: number;
  keyPrefix: string;
  keyGenerator?: (req: Request) => string;
}

export function createRateLimiter({
  points,
  duration,
  blockDuration = duration,
  keyPrefix,
  keyGenerator = req => req.ip ?? 'unknown-ip',
}: LimiterOptions) {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    points,
    duration,
    blockDuration,
    keyPrefix,
  });

  return async function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
    const key = keyGenerator(req);
    try {
      await limiter.consume(key);
      next();
    } catch (err) {
      const rlRes = err as RateLimiterRes;
      next(
        new TooManyRequestsError(undefined, {
          key,
          remainingPoints: rlRes?.remainingPoints,
          msBeforeNext: rlRes?.msBeforeNext,
        })
      );
    }
  };
}
