import { createOffsetPaginatedResponseSchema } from '../../../factories/createOffsetPaginatedResponse.schema';
import { scopeSummarySchema } from './summary.response.schema';
import { scopeDynamicFilterKeys, scopeFiltersSchema } from '../constants';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';

export const scopeListPageDataSchema = createOffsetPaginatedResponseSchema(
  scopeSummarySchema,
  scopeFiltersSchema,
  scopeDynamicFilterKeys
);

export const scopeListResponseSchema = createSuccessResponseSchema(scopeListPageDataSchema);

export type ScopeListPageData = zInfer<typeof scopeListPageDataSchema>;
export type ScopeListResponse = zInfer<typeof scopeListResponseSchema>;
