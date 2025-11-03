import {
  createFiltersSchema,
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { zInfer } from '../../../libs/z';
import { SERVICE_STATUS_FILTER } from '../constants';
import { serviceSummarySchema } from './summary.response.schema';

export const serviceListPageDataSchema = createOffsetPaginatedResponseSchema(
  serviceSummarySchema,
  createFiltersSchema({
    status: SERVICE_STATUS_FILTER,
  })
);
export const serviceListResponseSchema = createSuccessResponseSchema(serviceListPageDataSchema);

export type ServiceListPageData = zInfer<typeof serviceListPageDataSchema>;
export type ServiceListResponse = zInfer<typeof serviceListResponseSchema>;
