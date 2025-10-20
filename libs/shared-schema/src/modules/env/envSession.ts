import { z, zInfer } from '../../libs';

export const envSessionSchema = z.object({
  SESSION_COOKIE_DOMAIN: z.string().optional(),
  SESSION_ENCRYPTION_KEY: z.string().regex(/^[0-9a-f]{64}$/, {
    message: 'SESSION_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
  }),
  SESSION_IV: z.string().regex(/^[0-9a-f]{32}$/, {
    message: 'SESSION_IV must be a 32-character hex string (16 bytes)',
  }),
  SESSION_COOKIE_NAME: z.string().optional(),
  SESSION_SECRET: z.string().min(16),
  SESSION_COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none', 'coockie', 'sameSite']).optional(),
  SESSION_TTL_MS: z.string().optional(),
});

export type EnvSession = zInfer<typeof envSessionSchema>;
