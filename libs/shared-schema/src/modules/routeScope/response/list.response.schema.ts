import { createOffsetPaginatedResponseSchema } from '../../../factories/createOffsetPaginatedResponse.schema';
import { routeScopeSummarySchema } from './summary.response.schema';
import { routeScopeFiltersSchema } from '../constants';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs';

export const routeScopePageDataSchema = createOffsetPaginatedResponseSchema(
  routeScopeSummarySchema,
  routeScopeFiltersSchema
);

export const routeScopeListResponseSchema = createSuccessResponseSchema(routeScopePageDataSchema);

export type RouteScopeListPageData = zInfer<typeof routeScopePageDataSchema>;
export type RouteScopeListResponse = zInfer<typeof routeScopeListResponseSchema>;
