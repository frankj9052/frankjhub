import session, { CookieOptions, SessionOptions } from 'express-session';
import { Logger } from 'winston';
import { hostBelongsToDomain, parseCookieDomain } from '@frankjhub/shared-utils';
import { EnvBase, EnvSession } from '@frankjhub/shared-schema';
import { NextFunction, Request, Response } from 'express';
import crypto, { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';

type SessionEntry = {
  domain: string;
  middleware: ReturnType<typeof session>;
};

/**
 * SessionService: Nx 风格多域 session 封装
 * - 支持多域名 cookie 分发
 * - 支持 host-only fallback
 * - 支持注入 Redis store
 * - 可复用在多个服务
 *
 * @template T Env 类型（必须继承 EnvBase）
 */
export class SessionService<T extends EnvSession & EnvBase> {
  private env: T;
  private logger: Logger;
  // 为每个域族创建一个 session 中间件（可共用同一个 Redis store）
  private entries: SessionEntry[] = [];
  // 回落：host-only（适配临时域名/预览环境/IP/localhost）
  private fallbackHostOnly: ReturnType<typeof session>;
  private redisClient: Redis;

  constructor(env: T, logger: Logger, redisClient: Redis) {
    this.env = env;
    this.logger = logger.child('SessionService');
    this.redisClient = redisClient;

    const domains = parseCookieDomain(env.SESSION_COOKIE_DOMAIN);

    const buildMiddleware = (domain?: string) => session(this.buildSessionOptions(domain));

    if (domains.length === 0) {
      // 未配置：全部走 host-only（更安全的默认）
      this.fallbackHostOnly = buildMiddleware();
      this.logger.info('No SESSION_COOKIE_DOMAIN, using host-only session');
    } else {
      this.entries = domains.map(d => ({
        domain: d,
        middleware: buildMiddleware(d),
      }));
      this.fallbackHostOnly = buildMiddleware();
      this.logger.info('Initialized multi-domain session', { domains });
    }
  }

  /**
   * Express 中间件
   * - 根据请求 hostname 分发到对应域的 session middleware
   */
  getMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const host = String(req.hostname || '')
        .toLowerCase()
        .replace(/:\d+$/, '');

      for (const { domain, middleware } of this.entries) {
        if (hostBelongsToDomain(host, domain)) {
          this.logger.debug(`${host} -> domain ${domain}`);
          return middleware(req, res, next);
        }
      }

      // 未命中：host-only
      this.logger.debug(`${host} -> host-only fallback`);
      return this.fallbackHostOnly(req, res, next);
    };
  }

  /**
   * 构建单个域名对应的 SessionOptions
   * - AES 加密 Redis 存储
   * - cookie 配置
   * - session secret、genid、TTL 等
   */
  private buildSessionOptions(domain?: string): SessionOptions {
    const isProd = this.env.NODE_ENV === 'production';

    /* ---------- AES-256-CBC 加/解密 ---------- */
    const encrypt = (plain: string) => {
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(this.env.SESSION_ENCRYPTION_KEY, 'hex'),
        Buffer.from(this.env.SESSION_IV, 'hex')
      );
      return Buffer.concat([cipher.update(plain), cipher.final()]).toString('hex');
    };

    const decrypt = (hex: string) => {
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.env.SESSION_ENCRYPTION_KEY, 'hex'),
        Buffer.from(this.env.SESSION_IV, 'hex')
      );
      const buf = Buffer.concat([decipher.update(Buffer.from(hex, 'hex')), decipher.final()]);
      return buf.toString();
    };

    // redis store
    const store =
      this.redisClient && this.redisClient.status === 'ready'
        ? new RedisStore({
            client: this.redisClient,
            prefix: 'sess:',
            disableTouch: true,
            serializer: {
              stringify: sess => encrypt(JSON.stringify(sess)),
              parse: hex => JSON.parse(decrypt(hex)),
            },
          })
        : undefined;

    return {
      name: this.env.SESSION_COOKIE_NAME ?? 'sid',
      store,
      secret: this.env.SESSION_SECRET,
      genid: () => randomUUID(),
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: true,
      cookie: {
        domain: domain ?? undefined,
        httpOnly: true,
        secure: isProd ? ('auto' as const) : false,
        sameSite: (this.env.SESSION_COOKIE_SAMESITE as CookieOptions['sameSite']) ?? 'lax',
        maxAge: Number(this.env.SESSION_TTL_MS) || 1000 * 60 * 60 * 24 * 7,
      },
    };
  }
}
