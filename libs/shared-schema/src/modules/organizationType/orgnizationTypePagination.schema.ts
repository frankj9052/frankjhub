import { zInfer } from '../../libs/z';
import {
  OrganizationTypeFilterEnum,
  organizationTypeFilterListSchema,
} from '../../constants/organizationTypeFilter';
import { OrganizationTypeOrderByFieldsEnum } from '../../constants/organizationTypeOrderByField';
import { createOffsetPaginatedResponseSchema, createOffsetPaginationSchema } from '../../factories';
import { organizationTypeSchema } from './organizationType.schema';

// 分页参数
export const organizationTypePaginationSchema = createOffsetPaginationSchema(
  OrganizationTypeOrderByFieldsEnum,
  OrganizationTypeFilterEnum
);

// 分页响应
export const organizationTypePaginatedResponseSchema = createOffsetPaginatedResponseSchema(
  organizationTypeSchema,
  organizationTypeFilterListSchema
);

export type OrganizationTypePaginationParams = zInfer<typeof organizationTypePaginationSchema>;
export type OrganizationTypePaginatedResponse = zInfer<
  typeof organizationTypePaginatedResponseSchema
>;
