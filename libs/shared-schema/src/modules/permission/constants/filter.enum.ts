import { z } from '../../../libs/z';

export const PERMISSION_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type PermissionFilter = (typeof PERMISSION_FILTER)[keyof typeof PERMISSION_FILTER];

export const permissionFilterSchema = z.nativeEnum(PERMISSION_FILTER);
export const permissionFilterListSchema = z.array(permissionFilterSchema);
