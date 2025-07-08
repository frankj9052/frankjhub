import { z } from '../../../libs/z';

export const USER_FILTER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  UNVERIFIED_EMAIL: 'unverifiedEmail',
  INCOMPLETE_PROFILE: 'incompleteProfile',
} as const;

export type UserFilter = (typeof USER_FILTER)[keyof typeof USER_FILTER];
export const userFilterSchema = z.nativeEnum(USER_FILTER);
export const userFilterListSchema = z.array(userFilterSchema);
