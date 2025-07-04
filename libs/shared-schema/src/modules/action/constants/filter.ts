import { z } from '../../../libs/z';

export const ACTION_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
} as const;

export type ActionFilter = (typeof ACTION_FILTER)[keyof typeof ACTION_FILTER];
export const actionFilterSchema = z.nativeEnum(ACTION_FILTER);
export const actionFilterListSchema = z.array(actionFilterSchema);
