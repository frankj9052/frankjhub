import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { organizationTypeSchema } from '../entity';
import { organizationTypeFiltersSchema } from '../constants/filter.enum';

export const organizationTypeListPageDataSchema = createOffsetPaginatedResponseSchema(
  organizationTypeSchema,
  organizationTypeFiltersSchema
);

export const organizationTypeListResponseSchema = createSuccessResponseSchema(
  organizationTypeListPageDataSchema
);

export type OrganizationTypeListPageData = zInfer<typeof organizationTypeListPageDataSchema>;
export type OrganizationTypeListResponse = zInfer<typeof organizationTypeListResponseSchema>;
