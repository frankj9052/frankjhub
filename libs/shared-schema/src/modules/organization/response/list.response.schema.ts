import { createSuccessResponseSchema } from '../../../factories';
import { createOffsetPaginatedResponseSchema } from '../../../factories/createOffsetPaginatedResponse.schema';
import { zInfer } from '../../../libs/z';
import { organizationFilterListSchema } from '../constants/filter.enum';
import { organizationSchema } from '../entity';

export const organizationListPageDataSchema = createOffsetPaginatedResponseSchema(
  organizationSchema,
  organizationFilterListSchema
);

export const organizationListResponseSchema = createSuccessResponseSchema(
  organizationListPageDataSchema
);

export type OrganizationListPageData = zInfer<typeof organizationListPageDataSchema>;
export type OrganizationListResponse = zInfer<typeof organizationListResponseSchema>;
