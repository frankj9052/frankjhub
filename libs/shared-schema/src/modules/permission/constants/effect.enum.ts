import { z, zInfer } from '../../../libs';

export const PERMISSION_EFFECT = {
  ALLOW: 'allow',
  DENY: 'deny',
} as const;

export const permissionEffectSchema = z
  .nativeEnum(PERMISSION_EFFECT)
  .default(PERMISSION_EFFECT.ALLOW);
export type PermissionEffect = zInfer<typeof permissionEffectSchema>;
