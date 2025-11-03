import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { zInfer } from '../../../libs/z';
import { serviceFiltersSchema } from '../constants';
import { serviceSummarySchema } from './summary.response.schema';

export const serviceListPageDataSchema = createOffsetPaginatedResponseSchema(
  serviceSummarySchema,
  serviceFiltersSchema
);
export const serviceListResponseSchema = createSuccessResponseSchema(serviceListPageDataSchema);

export type ServiceListPageData = zInfer<typeof serviceListPageDataSchema>;
export type ServiceListResponse = zInfer<typeof serviceListResponseSchema>;
