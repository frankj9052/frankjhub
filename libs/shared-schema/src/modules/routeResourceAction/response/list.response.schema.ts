import { createOffsetPaginatedResponseSchema } from '../../../factories/createOffsetPaginatedResponse.schema';
import { routeResourceActionSummarySchema } from './summary.response.schema';
import {
  routeResourceActionDynamicFilterKeys,
  routeResourceActionFiltersSchema,
} from '../constants';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs';

export const routeResourceActionPageDataSchema = createOffsetPaginatedResponseSchema(
  routeResourceActionSummarySchema,
  routeResourceActionFiltersSchema,
  routeResourceActionDynamicFilterKeys
);

export const routeResourceActionListResponseSchema = createSuccessResponseSchema(
  routeResourceActionPageDataSchema
);

export type RouteResourceActionListPageData = zInfer<typeof routeResourceActionPageDataSchema>;
export type RouteResourceActionListResponse = zInfer<typeof routeResourceActionListResponseSchema>;
