import {
  RouteResourceActionDetail,
  RouteResourceActionRef,
  RouteResourceActionSummary,
} from '../response';

export const routeResourceActionRefData: RouteResourceActionRef = {
  id: '8f1c3a2b-4d5e-47f1-9a82-1b7e4f9a6c12',
  routeId: 'a9e7b2f4-1c8d-4b5f-9c33-6d2e9a1f7b54',
  resourceId: 'c3d1a7e5-8b9f-42c3-bf11-4f2a8e9d7a25',
  actionId: 'e2b9a6f1-3c7d-45b2-8f91-5a7c2e3b9d84',
};

export const routeResourceActionSummaryData: RouteResourceActionSummary = {
  id: '9a3f1b7e-4c5d-42a9-b8f6-7e2c9d3a6f21',
  routeId: 'c2d8a9e3-1f4b-4b9c-8e27-9b3f6d4a1e52',
  resourceId: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
  actionId: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
  actionName: 'DELETE_USER',
  createdAt: '2025-11-05T14:30:00.000Z',
  updatedAt: '2025-11-05T15:00:00.000Z',
  deletedAt: null,
};

export const routeResourceActionDetailData: RouteResourceActionDetail = {
  id: 'f1a3b7d2-4e5c-42b1-9a8e-6f2c7d4b1a5f',
  routeId: 'c2d8a9e3-1f4b-4b9c-8e27-9b3f6d4a1e52',
  resourceId: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
  actionId: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
  actionName: 'UPDATE_USER',
  createdAt: '2025-11-05T14:30:00.000Z',
  updatedAt: '2025-11-05T15:00:00.000Z',
  deletedAt: null,
  route: {
    id: 'b9c1f4a7-6d3e-42a8-8f1d-5a7c2e3b9d84',
    createdAt: '2025-10-01T12:00:00.000Z',
    updatedAt: '2025-10-15T12:00:00.000Z',
    deletedAt: null,
    path: '/users/:id',
    serviceId: 'd2e3f7b1-8a4c-4b9f-b2e5-3c7d1a8f9b12',
    routeRuleType: 'exact',
    methods: ['GET', 'PUT', 'PATCH'],
    isActive: true,
    rewrite: null,
  },
  resource: {
    id: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
    createdAt: '2025-09-20T08:00:00.000Z',
    updatedAt: '2025-10-05T08:00:00.000Z',
    deletedAt: null,
    isActive: true,
    namespace: 'user_management',
    entity: 'User',
    qualifier: ':id',
    fieldsMode: 'all',
    fields: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    resource_key: 'user_resource',
  },
  action: {
    id: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
    name: 'UPDATE_USER',
    displayName: 'Update User',
    isActive: true,
    isSystem: false,
    sortOrder: 1,
    createdAt: '2025-11-05T14:30:00.000Z',
    updatedAt: '2025-11-05T15:00:00.000Z',
    deletedAt: null,
  },
  createdBy: 'admin_user_1',
  updatedBy: 'admin_user_2',
  deletedBy: null,
};
