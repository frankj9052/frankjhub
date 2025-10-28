import { z, zInfer } from '../../../libs/z';

export const ACTION_STATUS_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type ActionStatusFilter = (typeof ACTION_STATUS_FILTER)[keyof typeof ACTION_STATUS_FILTER];
export const actionStatusFilterSchema = z.nativeEnum(ACTION_STATUS_FILTER);

export const ACTION_SYSTEM_FILTER = {
  ALL: 'all',
  SYSTEM: 'system',
  NON_SYSTEM: 'non_system',
} as const;
export const actionSystemFilterSchema = z.nativeEnum(ACTION_SYSTEM_FILTER);
export type ActionSystemFilter = zInfer<typeof actionSystemFilterSchema>;
