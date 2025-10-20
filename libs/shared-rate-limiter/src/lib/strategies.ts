import { Request } from 'express';
import { LimiterOptions } from './rateLimiter.class';

export type RateLimiterStrategyKey = 'global' | 'login' | 'signup';

export const RateLimiterStrategies: Record<RateLimiterStrategyKey, LimiterOptions> = {
  /** 🌐 全局 API 限流（API Gateway） */
  global: {
    points: 100,
    duration: 60,
    blockDuration: 60,
    keyPrefix: 'gateway_rl',
    keyGenerator: (req: Request) => req.ip || req.headers['x-forwarded-for']?.toString() || 'anon',
  },
  /** 👤 登录失败限流（Main Server） */
  login: {
    points: 10,
    duration: 900,
    blockDuration: 900,
    keyPrefix: 'login_fail_ip',
  },
  /** 📝 注册限流 */
  signup: {
    points: 5,
    duration: 600,
    blockDuration: 1800,
    keyPrefix: 'signup_fail_ip',
  },
};
