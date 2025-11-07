import { OrderEnum } from '../../../enums';
import { RouteScopeListRequest } from '../request/list.request.schema';
import { RouteScopeListResponse } from '../response/list.response.schema';

export const routeScopeListRequestData: RouteScopeListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.ASC, // or "DESC" depending on your OrderEnum
  orderBy: 'createdAt',
  search: 'user', // optional search term
  filters: {
    any: [
      {
        key: 'status',
        values: ['deleted'],
      },
    ],
  },
};

export const routeScopeListResponseData: RouteScopeListResponse = {
  status: 'success',
  data: {
    data: [
      {
        id: 'e3b0c442-98fc-4e9b-9c7c-1e98d65f3b92',
        routeId: 'b0e24f8f-3d8e-4d7d-96c2-7d3b7e69a05a',
        scopeId: '4cfc59ac-86d7-4e6b-8b24-62b8bcaab791',
        scopeKey: 'auth.user:read',
        createdAt: '2025-10-22T15:23:45.000Z',
        updatedAt: '2025-11-01T10:12:11.000Z',
        deletedAt: null,
      },
      {
        id: 'a1f5b63d-2b27-4318-a212-963b9fa03b88',
        routeId: 'b0e24f8f-3d8e-4d7d-96c2-7d3b7e69a05a',
        scopeId: 'd1a7e31d-0025-40d9-9c7f-08bbf63c20c4',
        scopeKey: 'auth.user:create',
        createdAt: '2025-10-25T09:45:10.000Z',
        updatedAt: null,
        deletedAt: null,
      },
      {
        id: '9eac7e30-4d3c-4428-bc9a-2e1cb6ac3e51',
        routeId: '3b1de5ac-7c3b-4879-a2d4-02b01c1b11ff',
        scopeId: '31fc13e8-bb2a-4cf3-8a5e-4b68d7f2fcb6',
        scopeKey: 'booking.appointment.:id:update',
        createdAt: '2025-09-15T12:10:05.000Z',
        updatedAt: '2025-10-01T18:44:19.000Z',
        deletedAt: '2025-10-30T08:00:00.000Z',
      },
      {
        id: 'c8d0e51a-81f6-4b90-bb39-9d8c32fb3b56',
        routeId: 'd1f5b63d-8b27-4318-a212-963b9fa03b11',
        scopeId: '7e2f4d6b-2d4a-4f6b-9e2a-7e1b4f1a9f88',
        scopeKey: 'inventory.item.*:list', // ✅ 对整个物品集合的浏览（带 * qualifier）
        createdAt: '2025-11-01T12:00:00.000Z',
        updatedAt: null,
        deletedAt: null,
      },
    ],
    total: 3,
    pageCount: 1,
    currentPage: 1,
    pageSize: 10,
    search: 'user',
    filters: {
      any: [
        {
          key: 'status',
          values: ['DELETED'],
        },
      ],
    },
  },
  message: 'Fetched route scopes successfully.',
};
