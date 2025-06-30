import { zInfer } from '../../libs/z';
import { createOffsetPaginatedResponseSchema, createOffsetPaginationSchema } from '../../factories';
import { OrganizationOrderByFieldsEnum } from '../../constants/organizationOrderByField';
import {
  OrganizationFilterEnum,
  organizationFilterListSchema,
} from '../../constants/organizationFilter';
import { organizationWithOrgTypeNameSchema } from './organization.schema';

// 分页参数
export const organizationPaginationSchema = createOffsetPaginationSchema(
  OrganizationOrderByFieldsEnum,
  OrganizationFilterEnum
);

// 分页响应
export const organizationPaginatedResponseSchema = createOffsetPaginatedResponseSchema(
  organizationWithOrgTypeNameSchema,
  organizationFilterListSchema
);

export type OrganizationPaginationParams = zInfer<typeof organizationPaginationSchema>;
export type OrganizationPaginatedResponse = zInfer<typeof organizationPaginatedResponseSchema>;
