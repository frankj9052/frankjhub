import { OrderEnum } from '../../../enums';
import { RouteResourceActionListRequest } from '../request/list.request.schema';
import { RouteResourceActionListResponse } from '../response/list.response.schema';

export const routeResourceActionListRequestData: RouteResourceActionListRequest = {
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
  routeId: 'c4f67a80-2b5f-4b1c-a97a-b4ef32a6e412',
  resourceId: 'f8d9b3a7-23c9-46c2-a4d2-8f514d452b0a',
};

export const routeResourceActionListResponseData: RouteResourceActionListResponse = {
  status: 'success',
  message: 'Fetched route-resource-action list successfully.',
  data: {
    data: [
      {
        id: '3c6a5b82-2e4b-4f1a-8c62-9b1e45fd9b8a',
        routeId: 'f2b9c7d1-0b4e-4a2d-bf3e-7a9e4b17b4f2',
        resourceId: 'a1e2d9b3-8d57-4a7a-9b3c-3b2e8e7c6f91',
        actionId: 'b7f1c2a9-61b4-4c9f-bcf3-2c8b4d6a8f73',
        actionName: 'READ_USER',
        createdAt: '2025-11-05T15:30:00.000Z',
        updatedAt: '2025-11-05T16:00:00.000Z',
        deletedAt: null,
      },
      {
        id: 'd9b8e4f2-17c3-4c2b-a8a7-6e3f1a1b8b02',
        routeId: 'f2b9c7d1-0b4e-4a2d-bf3e-7a9e4b17b4f2',
        resourceId: 'a1e2d9b3-8d57-4a7a-9b3c-3b2e8e7c6f91',
        actionId: 'e6a7b3f1-4c5d-42a7-bb7f-1a8c9e6b9f41',
        actionName: 'UPDATE_USER',
        createdAt: '2025-11-05T15:31:00.000Z',
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
    },
    routeId: 'f2b9c7d1-0b4e-4a2d-bf3e-7a9e4b17b4f2',
    resourceId: 'a1e2d9b3-8d57-4a7a-9b3c-3b2e8e7c6f91',
  },
};
