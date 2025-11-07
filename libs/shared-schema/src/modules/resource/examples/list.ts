import { OrderEnum } from '../../../enums';
import { RESOURCE_STATUS_FILTER } from '../constants/filter.enum';
import { ResourceListRequest } from '../request';
import { ResourceListResponse, ResourceOptionListResponse } from '../response';

export const resourceListRequestData: ResourceListRequest = {
  limit: 20, // 每页数量
  offset: 0, // 偏移量
  order: OrderEnum.ASC, // OrderEnum，假设有 'ASC' | 'DESC'
  orderBy: 'createdAt', // 排序字段
  search: 'main', // 可选搜索关键字

  filters: {
    any: [
      {
        key: 'status',
        values: [RESOURCE_STATUS_FILTER.ACTIVE, RESOURCE_STATUS_FILTER.INACTIVE],
      },
    ],
    all: [],
  },
};

export const resourceListResponseData: ResourceListResponse = {
  status: 'success',
  message: 'Resource list fetched successfully',
  data: {
    data: [
      {
        id: 'c9d4c053-49b6-410c-bc78-2d54a9991870',
        namespace: 'main',
        entity: 'user',
        qualifier: ':id',
        fieldsMode: 'whitelist',
        fields: ['id', 'name', 'email'],
        isActive: true,
        resource_key: 'main.user.:id',
        createdAt: '2025-10-30T10:00:00.000Z',
        updatedAt: '2025-10-30T11:00:00.000Z',
        deletedAt: null,
      },
      {
        id: 'b2e34f6a-2b7d-4d94-bf07-0e36ec4e7a0a',
        namespace: 'booking',
        entity: 'appointment',
        qualifier: '*',
        fieldsMode: 'all',
        fields: [],
        isActive: false,
        resource_key: 'booking.appointment.*',
        createdAt: '2025-09-10T08:30:00.000Z',
        updatedAt: '2025-10-01T09:15:00.000Z',
        deletedAt: null,
      },
    ],
    total: 2,
    pageCount: 1,
    currentPage: 1,
    pageSize: 20,
    search: 'user',
    filters: ['status:active'],
  },
};

export const resourceOptionListResponseData: ResourceOptionListResponse = {
  status: 'success',
  message: 'Fetched active resources successfully',
  data: [
    {
      id: 'a9e2c58f-8c4b-4a6d-b5a3-5b22b6e41894',
      resource_key: 'main-server.user:*',
    },
    {
      id: 'c52b7b31-2e12-45a9-8b93-693ab623b312',
      resource_key: 'booking.appointment:id',
    },
    {
      id: 'f873b4a1-64a9-48ff-9f26-bf72e42f13cd',
      resource_key: 'shift.schedule:*',
    },
    {
      id: '9d128e9e-32f7-4d58-bd89-1d1e6a5de84b',
      resource_key: 'message.chatroom:id',
    },
  ],
};
