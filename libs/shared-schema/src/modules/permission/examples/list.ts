import { OrderEnum } from '../../../enums';
import { PermissionListRequest } from '../request/list.request.schema';
import { PermissionListResponse } from '../response/list.response.schema';

export const permissionListRequestData: PermissionListRequest = {
  limit: 20,
  offset: 0,
  order: OrderEnum.ASC, // or "DESC"
  orderBy: 'createdAt',
  search: 'user',
  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'deleted'],
      },
    ],
    all: [
      {
        key: 'effect',
        values: ['allow'],
      },
    ],
  },
};

export const permissionListResponseData: PermissionListResponse = {
  status: 'success',
  message: 'Fetched permissions successfully.',
  data: {
    data: [
      {
        id: 'f1a3b7d2-4e5c-42b1-9a8e-6f2c7d4b1a5f',
        name: 'Update User',
        effect: 'allow',
        isActive: true,
        createdAt: '2025-11-05T14:30:00.000Z',
        updatedAt: '2025-11-05T15:00:00.000Z',
        deletedAt: null,
      },
      {
        id: 'a2b4c6d8-9e7f-4a1b-8c2d-5f3e6b7a8d91',
        name: 'Delete User',
        effect: 'deny',
        isActive: false,
        createdAt: '2025-11-04T10:15:00.000Z',
        updatedAt: null,
        deletedAt: '2025-11-05T12:00:00.000Z',
      },
    ],
    total: 2,
    pageCount: 1,
    currentPage: 1,
    pageSize: 20,
    search: 'user',
    filters: {
      any: [
        { key: 'status', values: ['ACTIVE', 'DELETED'] },
        { key: 'effect', values: ['ALLOW'] },
      ],
      all: [{ key: 'status', values: ['ACTIVE'] }],
    },
  },
};
