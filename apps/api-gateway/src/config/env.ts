import {} from '@frankjhub/shared-config';
import { envBaseSchema, envRedisSchema, z } from '@frankjhub/shared-schema';

const envSchema = envBaseSchema.extend({ envRedisSchema }).extend({
  // 会话（若需要读取用户会话）
  SESSION_SECRET: z.string().min(16),
  SESSION_COOKIE_NAME: z.string().default('sid'),
  SESSION_COOKIE_DOMAIN: z.string().optional(), // e.g. .frankjhub.com
  SESSION_SECURE: z.enum(['true', 'false']).default('true'),

  // 快照读取（回退）
  REGISTRY_SNAPSHOT_URL: z.string().url(),
  REGISTRY_API_KEY: z.string().min(1),
  SNAPSHOT_REFRESH_INTERVAL_MS: z.coerce.number().int().positive().default(8000),

  // JWT/JWKS（共享库会用）
  JWKS_URI: z.string().url(),
  JWT_ISSUER: z.string().min(1),

  // 速率限制
  RATE_LIMIT_POINTS: z.coerce.number().int().positive().default(300),
  RATE_LIMIT_DURATION: z.coerce.number().int().positive().default(60),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
});
