import { z } from 'zod';
import { UserOrderByFieldsEnum } from 'src/enums/userOrderByField.enum';
import { createOffsetPaginatedResponseSchema } from 'src/factories/createOffsetPaginatedResponse.schema';
import { createOffsetPaginationSchema } from 'src/factories/createOffsetPagination.schema';
import { userAllProfileSchema } from './userAllProfile.schema';

// 分页参数
export const userAllProfilePaginationSchema = createOffsetPaginationSchema(UserOrderByFieldsEnum);

// 分页响应
export const userAllProfilePaginatedResponseSchema =
  createOffsetPaginatedResponseSchema(userAllProfileSchema);

// 类型推导
export type UserPaginationParams = z.infer<typeof userAllProfilePaginationSchema>;
export type UserPaginatedResponse = z.infer<typeof userAllProfilePaginatedResponseSchema>;
