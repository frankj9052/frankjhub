import { zInfer } from '../../../libs';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { scopeDynamicFilterKeys, SCOPE_ORDER_BY_FIELDS, SCOPE_STATUS_FILTER } from '../constants';

export const scopeListRequestSchema = createOffsetPaginationSchema(
  SCOPE_ORDER_BY_FIELDS,
  {
    status: SCOPE_STATUS_FILTER,
  },
  scopeDynamicFilterKeys
);

export type ScopeListRequest = zInfer<typeof scopeListRequestSchema>;
