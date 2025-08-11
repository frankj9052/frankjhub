import { createFiltersSchema } from '../../../factories/createFilters.schema';
import { z } from '../../../libs/z';

export const ROLE_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export const ROLE_SOURCE_FILTER = {
  SOURCE_ORGANIZATION: 'source_organization',
  SOURCE_ORGANIZATION_TYPE: 'source_organization_type',
} as const;

export const roleFiltersSchema = createFiltersSchema({
  status: ROLE_STATUS_FILTER,
  source: ROLE_SOURCE_FILTER,
});

export type RoleStatusFilter = (typeof ROLE_STATUS_FILTER)[keyof typeof ROLE_STATUS_FILTER];
export const roleStatusFilterSchema = z.nativeEnum(ROLE_STATUS_FILTER);
export const roleStatusFilterListSchema = z.array(roleStatusFilterSchema);

export type RoleSourceFilter = (typeof ROLE_SOURCE_FILTER)[keyof typeof ROLE_SOURCE_FILTER];
export const roleSourceFilterSchema = z.nativeEnum(ROLE_SOURCE_FILTER);
export const roleSourceFilterListSchema = z.array(roleSourceFilterSchema);
