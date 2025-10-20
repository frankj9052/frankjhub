import { ConfigService } from '@frankjhub/shared-config';
import {
  envBaseSchema,
  envCorsSchema,
  envRedisSchema,
  envSessionSchema,
  z,
} from '@frankjhub/shared-schema';
import path from 'path';

const envSchema = envBaseSchema
  .merge(envRedisSchema)
  .merge(envCorsSchema)
  .merge(envSessionSchema)
  .extend({
    SESSION_SECURE: z.enum(['true', 'false']).default('true'),

    // 快照读取（回退）
    REGISTRY_SNAPSHOT_URL: z.string().url(),
    REGISTRY_API_KEY: z.string().min(1),
    SNAPSHOT_REFRESH_INTERVAL_MS: z.coerce.number().int().positive().default(8000),

    // JWT/JWKS（共享库会用）
    // JWKS_URI: z.string().url(),
    // JWT_ISSUER: z.string().min(1),

    // 速率限制
    RATE_LIMIT_POINTS: z.coerce.number().int().positive().default(300),
    RATE_LIMIT_DURATION: z.coerce.number().int().positive().default(60),
  });

const configService = new ConfigService(
  envSchema,
  path.resolve(process.cwd(), 'apps/main-server/')
);

export const env = configService.getEnv();
