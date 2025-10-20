import { z, zInfer } from '../../libs/z';

export const envBaseSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development').optional(),
  PORT: z.string().default('4000').optional(),
  HOST: z.string().default('localhost').optional(),
  /** Logger 使用 */
  /** 查阅package.json更新 */
  APP_NAME: z.string().optional(),
  /** 查阅package.json更新 */
  APP_VERSION: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info').optional(),
  LOG_TO_FILE: z.string().default('false').optional(),
});

export type EnvBase = zInfer<typeof envBaseSchema>;
