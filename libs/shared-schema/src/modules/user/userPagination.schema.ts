import { zInfer } from '../../libs/z';
import { createOffsetPaginatedResponseSchema } from '../../factories/createOffsetPaginatedResponse.schema';
import { createOffsetPaginationSchema } from '../../factories/createOffsetPagination.schema';
import { userAllProfileSchema } from './userAllProfile.schema';
import { UserFilterEnum, userFilterListSchema } from '../../constants/userStatusFilter';
import { UserOrderByFieldsEnum } from '../../constants/userOrderByField';

// 分页参数
export const userAllProfilePaginationSchema = createOffsetPaginationSchema(
  UserOrderByFieldsEnum,
  UserFilterEnum
);

// 分页响应
export const userAllProfilePaginatedResponseSchema = createOffsetPaginatedResponseSchema(
  userAllProfileSchema,
  userFilterListSchema
);

// 类型推导
export type UserPaginationParams = zInfer<typeof userAllProfilePaginationSchema>;
export type UserPaginatedResponse = zInfer<typeof userAllProfilePaginatedResponseSchema>;
