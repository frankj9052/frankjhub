import { z } from 'zod';
import { createOffsetPaginationSchema } from '../../common/schemas/createOffsetPagination.schema';
import { UserOrderByFieldsEnum } from '../enums/UserOrderByFields.enum';
import { createOffsetPaginatedResponseSchema } from '../../common/schemas/createOffsetPaginatedResponse.schema';
import { userAllProfileSchema } from './userAllProfile.dto';
import { registry } from '../../../config/openapiRegistry';

// 🔹 分页参数 schema（用于 API 请求）
export const userAllProfilePaginationSchema = registry.register(
  'UserAllProfilePaginationParams',
  createOffsetPaginationSchema(UserOrderByFieldsEnum)
);

// 🔹 分页响应 schema（用于 API 响应）
export const userAllProfilePaginatedResponseSchema = registry.register(
  'UserAllProfilePaginatedResponse',
  createOffsetPaginatedResponseSchema(userAllProfileSchema)
);

// 2. 推导出类型
export type UserPaginationParams = z.infer<
  ReturnType<typeof createOffsetPaginationSchema<UserOrderByFieldsEnum>>
>;
export type UserPaginatedResponse = z.infer<typeof userAllProfilePaginatedResponseSchema>;
