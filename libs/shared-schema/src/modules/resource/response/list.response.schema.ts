import {
  createFiltersSchema,
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { zInfer } from '../../../libs/z';
import { RESOURCE_STATUS_FILTER } from '../constants';
import { resourceSummarySchema } from './summary.response.schema';

export const resourceListPageDataSchema = createOffsetPaginatedResponseSchema(
  resourceSummarySchema,
  createFiltersSchema({
    status: RESOURCE_STATUS_FILTER,
  })
);

export const resourceListResponseSchema = createSuccessResponseSchema(resourceListPageDataSchema);

export type ResourceListPageData = zInfer<typeof resourceListPageDataSchema>;

export type ResourceListResponse = zInfer<typeof resourceListResponseSchema>;
