import { OrderEnum } from '../../../enums';
import { ServiceRouteListRequest } from '../request/list.request.schema';

export const serviceRouteListRequestData: ServiceRouteListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.DESC,
  orderBy: 'createdAt',
  search: 'user',
  serviceId: 'svc-12345',
  filters: {
    any: [
      {
        key: 'status',
        values: ['active'],
      },
    ],
    all: [],
  },
};
