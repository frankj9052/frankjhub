import { z } from '../../../libs/z';

export const RESOURCE_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type ResourceFilter = (typeof RESOURCE_FILTER)[keyof typeof RESOURCE_FILTER];
export const resourceFilterSchema = z.nativeEnum(RESOURCE_FILTER);
export const resourceFilterListSchema = z.array(resourceFilterSchema);
