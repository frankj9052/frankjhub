import { z } from '../../../libs/z';

export const ORGANIZATION_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type OrganizationFilter = (typeof ORGANIZATION_FILTER)[keyof typeof ORGANIZATION_FILTER];
export const organizationFilterSchema = z.nativeEnum(ORGANIZATION_FILTER);
export const organizationFilterListSchema = z.array(organizationFilterSchema);
