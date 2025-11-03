import { z, zInfer } from '../../../libs/z';

export const RESOURCE_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export const resourceStatusFilterSchema = z.nativeEnum(RESOURCE_STATUS_FILTER);
export type ResourceStatusFilter = zInfer<typeof resourceStatusFilterSchema>;
