import { OrderEnum } from '../../../enums';
import { RESOURCE_STATUS_FILTER } from '../constants/filter.enum';
import { ResourceListRequest } from '../request';
import { ResourceListResponse } from '../response';

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
        metadata: {
          description: 'User entity for main service',
          owner: 'adminUser',
        },
        resource_key: 'main.user.:id',
        version: 3,
        createdAt: '2025-10-30T10:00:00.000Z',
        createdBy: 'system',
        updatedAt: '2025-10-30T11:00:00.000Z',
        updatedBy: 'adminUser',
        deletedAt: null,
        deletedBy: null,
      },
      {
        id: 'b2e34f6a-2b7d-4d94-bf07-0e36ec4e7a0a',
        namespace: 'booking',
        entity: 'appointment',
        qualifier: '*',
        fieldsMode: 'all',
        fields: [],
        isActive: false,
        metadata: {
          deprecated: true,
          reason: 'Merged into unified scheduling module',
        },
        resource_key: 'booking.appointment.*',
        version: 1,
        createdAt: '2025-09-10T08:30:00.000Z',
        createdBy: 'superAdmin',
        updatedAt: '2025-10-01T09:15:00.000Z',
        updatedBy: 'adminUser',
        deletedAt: null,
        deletedBy: null,
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
