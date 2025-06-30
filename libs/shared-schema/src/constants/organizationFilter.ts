import { z } from '../libs/z';

export const OrganizationFilterEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type OrganizationFilter =
  (typeof OrganizationFilterEnum)[keyof typeof OrganizationFilterEnum];
export const organizationFilterSchema = z.nativeEnum(OrganizationFilterEnum);
export const organizationFilterListSchema = z.array(organizationFilterSchema);
