import { z, zInfer } from '../../../libs';

export const AUTH_MODE = {
  ANY: 'any',
  ALL: 'all',
} as const;

export const AuthModeSchema = z.nativeEnum(AUTH_MODE);

export type AuthMode = zInfer<typeof AuthModeSchema>;
