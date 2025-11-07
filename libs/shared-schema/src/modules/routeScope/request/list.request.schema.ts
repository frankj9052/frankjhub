import { zInfer } from '../../../libs';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import { ROUTE_SCOPE_ORDER_BY_FIELD, ROUTE_SCOPE_STATUS_FILTER } from '../constants';

export const routeScopeListRequestSchema = createOffsetPaginationSchema(
  ROUTE_SCOPE_ORDER_BY_FIELD,
  {
    status: ROUTE_SCOPE_STATUS_FILTER,
  }
);

export type RouteScopeListRequest = zInfer<typeof routeScopeListRequestSchema>;
