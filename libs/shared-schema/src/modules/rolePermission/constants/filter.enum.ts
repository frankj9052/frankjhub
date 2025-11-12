import { createFiltersSchema } from '../../../factories/createFilters.schema';

export const ROLE_PERMISSION_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type RolePermissionStatusFilter =
  (typeof ROLE_PERMISSION_STATUS_FILTER)[keyof typeof ROLE_PERMISSION_STATUS_FILTER];

export const rolePermissionFiltersSchema = createFiltersSchema({
  status: ROLE_PERMISSION_STATUS_FILTER,
});
