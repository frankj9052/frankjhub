import { z } from 'zod/v3';
import path from 'path';
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({ path: path.resolve(process.cwd(), 'apps/main-server/') });

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  HOST: z.string().default('localhost'),
  CORS_ORIGIN: z.string().optional(),
  JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_TO_FILE: z.string().default('false'),
  SENTRY_DSN: z.string().optional(),
  DATABASE_URL: z.string().optional(), // SaaS URL，如 Neon
  DATABASE_SSL: z.string().default('true'),
  ENABLE_SEEDERS: z.string().default('true'),
  REDIS_URL: z.string(),
  APP_VERSION: z.string().optional(),
  SESSION_COOKIE_DOMAIN: z.string().optional(),
  // 新增：pg-pool 配置
  PG_POOL_MAX: z.string().default('50'),
  PG_IDLE_MS: z.string().default('3000'),
  PG_CONN_TIMEOUT_MS: z.string().default('2000'),
  SUPER_ADMIN_EMAIL: z.string(),
  SUPER_ADMIN_PASSWORD: z.string(),
  APP_BASE_URL: z.string(),

  // 新增: Session相关校验
  SESSION_SECRET: z.string(), // 只要是非空字符串就行
  SESSION_ENCRYPTION_KEY: z.string().regex(/^[0-9a-f]{64}$/, {
    message: 'SESSION_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
  }),
  SESSION_IV: z.string().regex(/^[0-9a-f]{32}$/, {
    message: 'SESSION_IV must be a 32-character hex string (16 bytes)',
  }),
  SESSION_COOKIE_NAME: z.string().optional(),
  SESSION_COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none', 'coockie', 'sameSite']).optional(),
  SESSION_TTL_MS: z.string().optional(),
  JWT_SERVICE_PRIVATE_KEY_PATH: z
    .string()
    .default('apps/main-server/src/modules/service-auth/keys/private.pem'),
  JWT_SERVICE_PUBLIC_KEY_PATH: z
    .string()
    .default('apps/main-server/src/modules/service-auth/keys/public.pem'),
  SERVICE_AUTH_JWKS_URL: z.string().default('http://localhost:3100/api//.well-known/jwks.json'),
  // schedule jobs
  ENABLE_SCHEDULERS: z.string().default('false').optional(),
  ENABLE_INVITATION_EXPIRE: z.string().default('true').optional(),
  // resend
  RESEND_API_KEY: z.string(),
  RESEND_FROM_DEFAULT: z.string().default('Frankjhub <no-reply@email.frankjhub.com>'),
  RESEND_REPLY_TO_DEFAULT: z.string().default('support@email.frankjhub.com'),
  RESEND_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_ENABLE_QUEUE: z.string().default('true'),
  EMAIL_MAX_RETRY: z.string().default('3'),
  EMAIL_RATE_LIMIT_PER_MINUTE: z.string().default('120'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  // 新增api gateway
  REGISTRY_SNAPSHOT_URL: z.string(),
  REGISTRY_API_KEY: z.string(),
  JWT_ISSUER: z.string().default('jurong-auth'),
});

// 如果没有 DATABASE_URL，就强制要求 host + user + db
const extendedSchema = baseSchema
  .extend({
    DB_HOST: z.string().optional(),
    DB_PORT: z.string().default('5432').optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    const usingUrl = !!env.DATABASE_URL;
    const requiredIfNoUrl = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

    if (!usingUrl) {
      for (const key of requiredIfNoUrl) {
        if (!env[key as keyof typeof env]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key} is required if DATABASE_URL is not provided`,
            path: [key],
          });
        }
      }
    }
  });

const parsed = extendedSchema.safeParse(process.env);

if (!parsed.success) {
  // ❗ 使用 console.error 替代 logger，避免循环引用
  console.error('❌ Invalid environment variables!');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
