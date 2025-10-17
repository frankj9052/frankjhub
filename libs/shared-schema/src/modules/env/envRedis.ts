import { z, zInfer } from '../../libs/z';

export const envRedisSchema = z.object({
  REDIS_URL: z.string(),
});

export type EnvRedis = zInfer<typeof envRedisSchema>;
