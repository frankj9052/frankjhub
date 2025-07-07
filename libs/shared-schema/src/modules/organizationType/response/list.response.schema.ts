import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { organizationTypeSchema } from '../entity';
import { organizationTypeFilterListSchema } from '../constants';

export const organizationTypeListPageDataSchema = createOffsetPaginatedResponseSchema(
  organizationTypeSchema,
  organizationTypeFilterListSchema
);

export const organizationTypeListResponseSchema = createSuccessResponseSchema(
  organizationTypeListPageDataSchema
);

export type OrganizationTypeListPageData = zInfer<typeof organizationTypeListPageDataSchema>;
export type OrganizationTypeListResponse = zInfer<typeof organizationTypeListResponseSchema>;
