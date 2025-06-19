import { zInfer } from '../../libs/z';
import { UserOrderByFieldsEnum } from '../../enums/userOrderByField.enum';
import { createOffsetPaginatedResponseSchema } from '../../factories/createOffsetPaginatedResponse.schema';
import { createOffsetPaginationSchema } from '../../factories/createOffsetPagination.schema';
import { userAllProfileSchema } from './userAllProfile.schema';

// 分页参数
export const userAllProfilePaginationSchema = createOffsetPaginationSchema(UserOrderByFieldsEnum);

// 分页响应
export const userAllProfilePaginatedResponseSchema =
  createOffsetPaginatedResponseSchema(userAllProfileSchema);

// 类型推导
export type UserPaginationParams = zInfer<typeof userAllProfilePaginationSchema>;
export type UserPaginatedResponse = zInfer<typeof userAllProfilePaginatedResponseSchema>;
