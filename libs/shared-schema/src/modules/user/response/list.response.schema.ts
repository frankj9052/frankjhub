import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { userFilterListSchema } from '../constants';
import { userSchema } from '../entity';

export const userListPageDataSchema = createOffsetPaginatedResponseSchema(
  userSchema,
  userFilterListSchema
);

export const userListResponseSchema = createSuccessResponseSchema(userListPageDataSchema);

export type UserListPageData = zInfer<typeof userListPageDataSchema>;
export type UserListResponse = zInfer<typeof userListResponseSchema>;
