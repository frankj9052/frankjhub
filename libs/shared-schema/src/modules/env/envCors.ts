import { z, zInfer } from '../../libs';

export const envCorsSchema = z.object({
  CORS_ORIGIN: z.string().optional(),
});

export type EnvCors = zInfer<typeof envCorsSchema>;
