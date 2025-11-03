import { OrderEnum } from '../../../enums';
import { ServiceListRequest } from '../request/list.request.schema';
import { ServiceListResponse } from '../response/list.response.schema';

export const serviceListRequestData: ServiceListRequest = {
  limit: 25,
  offset: 0,
  order: OrderEnum.DESC,
  orderBy: 'updatedAt',
  search: 'payment',
  filters: {
    all: [
      {
        key: 'status',
        values: ['active'],
      },
    ],
  },
};

export const ServiceListResponseData: ServiceListResponse = {
  status: 'success',
  message: 'Fetched service list successfully.',
  data: {
    data: [
      {
        serviceId: 'auth-service',
        name: 'Authentication Service',
        createdAt: '2025-10-01T12:15:30Z',
        id: 'svc_001',
        baseUrl: 'https://auth.example.com',
        ownerTeam: 'Platform Security',
        isActive: true,
        lastRotatedAt: '2025-10-20T08:00:00Z',
        updatedAt: '2025-10-25T10:10:00Z',
        deletedAt: null,
      },
      {
        serviceId: 'user-service',
        name: 'User Management Service',
        createdAt: '2025-09-12T09:45:00Z',
        id: 'svc_002',
        baseUrl: 'https://users.example.com',
        ownerTeam: 'Core Services',
        isActive: true,
        lastRotatedAt: '2025-09-20T07:00:00Z',
        updatedAt: '2025-10-28T11:00:00Z',
        deletedAt: null,
      },
      {
        serviceId: 'billing-service',
        name: 'Billing Service',
        createdAt: '2025-08-02T14:00:00Z',
        id: 'svc_003',
        baseUrl: 'https://billing.example.com',
        ownerTeam: 'Finance Ops',
        isActive: false,
        lastRotatedAt: '2025-08-20T06:30:00Z',
        updatedAt: '2025-09-01T09:10:00Z',
        deletedAt: null,
      },
      {
        serviceId: 'reporting-service',
        name: 'Reporting and Analytics',
        createdAt: '2025-07-01T10:00:00Z',
        id: 'svc_004',
        baseUrl: 'https://reports.example.com',
        ownerTeam: 'Data Engineering',
        isActive: true,
        lastRotatedAt: null,
        updatedAt: '2025-10-10T12:30:00Z',
        deletedAt: null,
      },
      {
        serviceId: 'legacy-service',
        name: 'Legacy API Gateway',
        createdAt: '2024-12-15T09:00:00Z',
        id: 'svc_005',
        baseUrl: 'https://legacy.example.com',
        ownerTeam: null,
        isActive: false,
        lastRotatedAt: null,
        updatedAt: null,
        deletedAt: '2025-06-30T00:00:00Z',
      },
    ],
    total: 57,
    pageCount: 12,
    currentPage: 1,
    pageSize: 5,
    search: 'service',
    filters: {
      all: [
        {
          key: 'status',
          values: ['ACTIVE', 'INACTIVE'],
        },
      ],
    },
  },
};
