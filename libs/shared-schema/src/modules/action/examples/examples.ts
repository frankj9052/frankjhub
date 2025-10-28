import { ActionDetail, ActionListPageData, ActionListResponse, ActionRef } from '../response';

export const actionDataExample: ActionDetail = {
  id: 'f1e2d3c4-b5a6-7890-abcd-0987654321fe',
  name: 'DELETE_USER',
  displayName: 'Delete User',
  aliases: ['REMOVE_USER'],
  isSystem: true,
  sortOrder: 2,
  isActive: false,
  createdAt: new Date('2025-01-01T08:00:00Z').toISOString(),
  createdBy: 'admin',
  updatedAt: new Date('2025-05-01T10:00:00Z').toISOString(),
  updatedBy: 'admin',
  deletedAt: new Date('2025-06-01T09:00:00Z').toISOString(),
  deletedBy: 'admin',
  description: 'Allows deletion of a user from the system',
};

export const actionRefDataExample: ActionRef = {
  id: actionDataExample.id,
  name: actionDataExample.name,
  displayName: actionDataExample.displayName,
};

export const actionListPageDataExample: ActionListPageData = {
  data: [
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
      name: 'CREATE_USER',
      displayName: 'Create User',
      isSystem: true,
      sortOrder: 1,
      isActive: true,
      deletedAt: null,
    },
    {
      id: 'b2c3d4e5-f6a7-8901-bcde-2345678901fa',
      name: 'UPDATE_USER',
      displayName: 'Update User',
      isSystem: true,
      sortOrder: 2,
      isActive: true,
      deletedAt: null,
    },
    {
      id: 'c3d4e5f6-a7b8-9012-cdef-3456789012ab',
      name: 'DELETE_USER',
      displayName: 'Delete User',
      isSystem: true,
      sortOrder: 3,
      isActive: false,
      deletedAt: '2025-06-01T09:00:00Z',
    },
    {
      id: 'd4e5f6a7-b8c9-0123-def0-4567890123cd',
      name: 'READ_USER',
      displayName: 'Read User',
      isSystem: false,
      sortOrder: 4,
      isActive: true,
      deletedAt: null,
    },
    {
      id: 'e5f6a7b8-c9d0-1234-ef01-5678901234de',
      name: 'MANAGE_ROLES',
      displayName: 'Manage Roles',
      isSystem: false,
      sortOrder: 5,
      isActive: true,
      deletedAt: null,
    },
  ],
  total: 2,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'appointment',
  filters: {
    any: [
      {
        key: 'status',
        values: [], // 可以填 ['active','inactive','deleted'] 之类
      },
      {
        key: 'system',
        values: [], // 可以填 ['system','non_system']
      },
    ],
    all: [],
  },
};

export const actionListResponseExample: ActionListResponse = {
  status: 'success',
  message: 'Get action list successful',
  data: actionListPageDataExample,
};
