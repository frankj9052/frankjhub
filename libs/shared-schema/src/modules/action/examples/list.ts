import { OrderEnum } from '../../../enums/order.enum';
import { ActionListRequest } from '../request';
import { ActionListResponse } from '../response';

export const actionListRequestData: ActionListRequest = {
  limit: 10,
  offset: 0,
  order: OrderEnum.ASC, // 或 OrderEnum.DESC
  orderBy: 'name', // 可以是 'name' | 'sortOrder' | 'createdAt' | 'updatedAt'
  search: 'user', // 可选，搜索关键字
  filters: {
    any: [
      {
        key: 'status',
        values: ['active', 'deleted'], // 可以选 ACTIVE/INACTIVE/DELETED
      },
      {
        key: 'system',
        values: ['system'], // 可以选 ALL/SYSTEM/NON_SYSTEM
      },
    ],
    all: [
      {
        key: 'status',
        values: ['active'], // all 条件，必须同时满足
      },
    ],
  },
};

export const actionListResponseData: ActionListResponse = {
  status: 'success',
  message: 'Action list fetched successfully',
  data: {
    data: [
      {
        id: 'a1f2c053-49b6-410c-bc78-2d54a9991111',
        name: 'readUser',
        displayName: 'Read User',
        sortOrder: 1,
        isSystem: true,
        isActive: true,
        createdAt: '2025-10-01T09:00:00.000Z',
        updatedAt: '2025-10-28T12:00:00.000Z',
        deletedAt: null,
      },
      {
        id: 'b2f3d6aa-2b7d-4d94-bf07-0e36ec4e2222',
        name: 'updateUser',
        displayName: 'Update User',
        sortOrder: 2,
        isSystem: false,
        isActive: false,
        createdAt: '2025-09-15T08:30:00.000Z',
        updatedAt: '2025-10-10T11:15:00.000Z',
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
          values: ['ACTIVE', 'DELETED'],
        },
      ],
      all: [
        {
          key: 'system',
          values: ['ALL'],
        },
      ],
    },
  },
};
