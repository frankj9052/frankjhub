import { z } from '../libs/z';

export const OrganizationTypeFilterEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type OrganizationTypeFilter =
  (typeof OrganizationTypeFilterEnum)[keyof typeof OrganizationTypeFilterEnum];
export const organizationTypeFilterSchema = z.nativeEnum(OrganizationTypeFilterEnum);
export const organizationTypeFilterListSchema = z.array(organizationTypeFilterSchema);
