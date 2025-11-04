import { OrderEnum } from '../../../enums';
import { ServiceRouteListRequest } from '../request/list.request.schema';
import { ServiceRouteListResponse } from '../response';

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

export const serviceRouteListResponseData: ServiceRouteListResponse = {
  status: 'success',
  message: 'Fetched service routes successfully',
  data: {
    data: [
      {
        id: 'route-001',
        serviceId: 'svc-12345',
        path: '/api/users',
        routeRuleType: 'prefix',
        methods: ['GET', 'POST'],
        isActive: true,
        createdAt: '2025-11-01T10:00:00.000Z',
        updatedAt: '2025-11-03T12:30:00.000Z',
        deletedAt: null,
        rewrite: null,
      },
      {
        id: 'route-002',
        serviceId: 'svc-12345',
        path: '/api/users/:id',
        routeRuleType: 'exact',
        methods: ['GET', 'PUT', 'DELETE'],
        isActive: false,
        createdAt: '2025-10-28T09:15:00.000Z',
        updatedAt: '2025-11-02T14:45:00.000Z',
        deletedAt: null,
        rewrite: '/api/v2/users/:id',
      },
    ],
    total: 2,
    pageCount: 1,
    currentPage: 1,
    pageSize: 20,
    search: 'user',
    serviceId: 'svc-12345',
    filters: {
      any: [
        {
          key: 'status',
          values: ['ACTIVE'],
        },
      ],
      all: [],
    },
  },
};
