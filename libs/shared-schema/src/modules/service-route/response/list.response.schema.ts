import { zInfer } from '../../../libs/z';
import {
  createOffsetPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../../../factories';
import { serviceRouteDynamicFilterKeys, serviceRouteFiltersSchema } from '../constants';
import { serviceRouteSummarySchema } from './summary.response.schema';

export const serviceRouteListPageDataSchema = createOffsetPaginatedResponseSchema(
  serviceRouteSummarySchema,
  serviceRouteFiltersSchema,
  serviceRouteDynamicFilterKeys
);

export const serviceRouteListResponseSchema = createSuccessResponseSchema(
  serviceRouteListPageDataSchema
);

export type ServiceRouteListPageData = zInfer<typeof serviceRouteListPageDataSchema>;
export type ServiceRouteListResponse = zInfer<typeof serviceRouteListResponseSchema>;
