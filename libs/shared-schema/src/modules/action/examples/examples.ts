import { ActionDto, ActionRef } from '../entity';
import { ActionListPageData, ActionListResponse } from '../response';

export const actionDataExample: ActionDto = {
  id: 'a3e1b2c4-7d56-42f9-a938-9a5c6b1a2f3d',
  name: 'create_appointment',
  description: 'Allows users to create a new appointment',
  isActive: true,
  createdAt: '2025-07-05T15:00:00.000Z',
  createdBy: 'user_123',
  updatedAt: '2025-07-05T16:00:00.000Z',
  updatedBy: 'user_123',
  deletedAt: null,
  deletedBy: null,
};

export const actionRefDataExample: ActionRef = {
  id: actionDataExample.id,
  name: actionDataExample.name,
  description: actionDataExample.description,
};

export const actionListPageDataExample: ActionListPageData = {
  data: [
    {
      id: 'b1e2a3f4-5c6d-7e8f-9012-3456789abcde',
      name: 'create_appointment',
      description: 'Allows users to create a new appointment',
      isActive: true,
      createdAt: '2025-07-01T10:00:00.000Z',
      createdBy: 'user_001',
      updatedAt: '2025-07-02T11:00:00.000Z',
      updatedBy: 'user_001',
      deletedAt: null,
      deletedBy: null,
    },
    {
      id: 'c2f3b4a5-6d7e-8f90-1234-56789abcdef0',
      name: 'delete_appointment',
      description: 'Allows admins to delete existing appointments',
      isActive: false,
      createdAt: '2025-06-15T09:30:00.000Z',
      createdBy: 'user_002',
      updatedAt: '2025-06-20T13:45:00.000Z',
      updatedBy: 'user_003',
      deletedAt: '2025-07-01T08:00:00.000Z',
      deletedBy: 'user_004',
    },
  ],
  total: 2,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'appointment',
  filters: ['active', 'deleted'],
};

export const actionListResponseExample: ActionListResponse = {
  status: 'success',
  message: 'Get action list successful',
  data: actionListPageDataExample,
};
