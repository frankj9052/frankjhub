import { z } from '../../../libs/z';

export const ROLE_FILTER = {
  SOURCE_ORGANIZATION: 'source_organization',
  SOURCE_ORGANIZATION_TYPE: 'source_organization_type',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type RoleFilter = (typeof ROLE_FILTER)[keyof typeof ROLE_FILTER];

export const roleFilterSchema = z.nativeEnum(ROLE_FILTER);
export const roleFilterListSchema = z.array(roleFilterSchema);
