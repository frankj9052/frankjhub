import { zInfer } from '../../../libs';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import {
  ROUTE_RESOURCE_ACTION_ORDER_BY_FIELD,
  ROUTE_RESOURCE_ACTION_STATUS_FILTER,
  routeResourceActionDynamicFilterKeys,
} from '../constants';

export const routeResourceActionListRequestSchema = createOffsetPaginationSchema(
  ROUTE_RESOURCE_ACTION_ORDER_BY_FIELD,
  {
    status: ROUTE_RESOURCE_ACTION_STATUS_FILTER,
  },
  routeResourceActionDynamicFilterKeys
);

export type RouteResourceActionListRequest = zInfer<typeof routeResourceActionListRequestSchema>;
