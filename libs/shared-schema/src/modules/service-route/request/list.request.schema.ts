import { zInfer } from '../../../libs';
import { createOffsetPaginationSchema } from '../../../factories/createOffsetPagination.schema';
import {
  serviceRouteDynamicFilterKeys,
  SERVICE_ROUTE_ORDER_BY_FIELD,
  SERVICE_ROUTE_STATUS_FILTER,
} from '../constants';

export const serviceRouteListRequestSchema = createOffsetPaginationSchema(
  SERVICE_ROUTE_ORDER_BY_FIELD,
  {
    status: SERVICE_ROUTE_STATUS_FILTER,
  },
  serviceRouteDynamicFilterKeys
);

export type ServiceRouteListRequest = zInfer<typeof serviceRouteListRequestSchema>;
