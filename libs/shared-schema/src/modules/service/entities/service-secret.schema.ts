import { z, zInfer } from '../../../libs/z';

export const serviceSecretSchema = z
  .string()
  .refine(v => v.startsWith('$argon2') || v.length >= 8, {
    message:
      'serviceSecret must be either an already hashed argon2 string, or a plaintext string of at least 8 characters (which will be hashed before being stored).',
  });

export type ServiceSecret = zInfer<typeof serviceSecretSchema>;
