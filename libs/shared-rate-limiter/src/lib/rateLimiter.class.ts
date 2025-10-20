import { Redis } from 'ioredis';
import { NextFunction, Request, Response } from 'express';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { TooManyRequestsError } from '@frankjhub/shared-errors';

export interface LimiterOptions {
  /** 每 duration 秒最多允许 points 次请求 */
  points: number;
  /** 窗口期：每 duration 秒最多允许 points 次请求 */
  duration: number;
  /** 达到上限后封禁 blockDuration 秒 */
  blockDuration?: number;
  /** 区分日志 */
  keyPrefix: string;
  /** 区分redis键 */
  keyGenerator?: (req: Request) => string;
}

/**
 * RateLimiterService
 * - 提供基于 Redis 的灵活限流中间件
 * - 支持按不同策略创建多个限流器
 */
export class RateLimiterService {
  private redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  /**
   * 创建一个限流中间件实例
   */
  createLimiter({
    points,
    duration,
    blockDuration = duration,
    keyPrefix,
    keyGenerator = req => req.ip ?? 'unknown-ip',
  }: LimiterOptions) {
    const limiter = new RateLimiterRedis({
      storeClient: this.redisClient,
      points,
      duration,
      blockDuration,
      keyPrefix,
    });

    return async (req: Request, res: Response, next: NextFunction) => {
      const key = keyGenerator(req);
      try {
        await limiter.consume(key);
        next();
      } catch (error) {
        const rlRes = error as RateLimiterRes;
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
}
