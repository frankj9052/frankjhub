import { z } from '../libs/z';

export const UserFilterEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  UNVERIFIED_EMAIL: 'unverifiedEmail',
  INCOMPLETE_PROFILE: 'incompleteProfile',
} as const;

export type UserStatusFilter = (typeof UserFilterEnum)[keyof typeof UserFilterEnum];
export const userFilterSchema = z.nativeEnum(UserFilterEnum);
export const userFilterListSchema = z.array(userFilterSchema);
