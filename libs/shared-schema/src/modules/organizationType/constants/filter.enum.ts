import { z } from '../../../libs/z';

export const ORGANIZATION_TYPE_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type OrganizationTypeFilter =
  (typeof ORGANIZATION_TYPE_FILTER)[keyof typeof ORGANIZATION_TYPE_FILTER];
export const organizationTypeFilterSchema = z.nativeEnum(ORGANIZATION_TYPE_FILTER);
export const organizationTypeFilterListSchema = z.array(organizationTypeFilterSchema);
