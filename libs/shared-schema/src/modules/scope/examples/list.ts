import { OrderEnum } from '../../../enums';
import { ScopeListRequest } from '../request/list.request.schema';
import { ScopeListResponse } from '../response/list.response.schema';

export const scopeListRequestData: ScopeListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.ASC,
  orderBy: 'actionName',
  search: 'read', // 可选搜索关键字
  resourceId: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc', // 可选
  filters: {
    any: [
      {
        key: 'status',
        values: ['deleted'],
      },
    ],
    all: [],
  },
};

export const scopeListResponseData: ScopeListResponse = {
  status: 'success',
  data: {
    data: [
      {
        id: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
        actionName: 'read',
        key: 'service1.user:read',
        createdAt: '2025-11-04T11:00:00Z',
        updatedAt: '2025-11-04T12:00:00Z',
        deletedAt: null,
      },
      {
        id: 'b2d3e4f5-6a7b-48c3-9d2e-abcdef123456',
        actionName: 'write',
        key: 'service1.user:write',
        createdAt: '2025-11-04T11:05:00Z',
        updatedAt: null,
        deletedAt: null,
      },
    ],
    total: 2,
    pageCount: 1,
    currentPage: 1,
    pageSize: 20,
    search: 'user',
    filters: {
      any: [
        {
          key: 'status',
          values: ['DELETED'],
        },
      ],
      all: [],
    },
    resourceId: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
  },
  message: 'Scope list fetched successfully',
};
