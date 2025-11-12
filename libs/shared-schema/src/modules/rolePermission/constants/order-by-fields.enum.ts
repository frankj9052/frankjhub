import { z, zInfer } from '../../../libs';

export const ROLE_PERMISSION_ORDER_BY_FIELD = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;

export const rolePermissionOrderByField = z.nativeEnum(ROLE_PERMISSION_ORDER_BY_FIELD);
export type RolePermissionOrderByField = zInfer<typeof rolePermissionOrderByField>;
