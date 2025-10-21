import { z, zInfer } from '../../libs';

export const EnvJwtSchema = z.object({
  JWKS_URI: z.string().url(),
  JWT_ISSUER: z.string(),
});

export type EnvJwt = zInfer<typeof EnvJwtSchema>;
