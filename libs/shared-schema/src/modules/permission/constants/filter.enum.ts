import { createFiltersSchema } from '../../../factories';
import { PERMISSION_EFFECT } from './effect.enum';

export const PERMISSION_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type PermissionStatusFilter =
  (typeof PERMISSION_STATUS_FILTER)[keyof typeof PERMISSION_STATUS_FILTER];

export const PERMISSION_FILTERS = {
  status: PERMISSION_STATUS_FILTER,
  effect: PERMISSION_EFFECT,
} as const;

export const permissionFiltersSchema = createFiltersSchema(PERMISSION_FILTERS);
