import { PermissionDto } from '../entity';
import { PermissionListPageData, PermissionListResponse } from '../response/list.response.schema';
import { PermissionOptionListResponse } from '../response/option-list.response.schema';
import { PermissionSingleResponse } from '../response/single.response.schema';

export const permissionDataExample: PermissionDto = {
  id: 'd8d5d735-7722-4be4-8be0-1cd1d9349e61',
  name: 'appointment:[create,delete]@date,status?ownerOnly=true',
  description: 'Allows creating and deleting appointments with field restrictions.',
  fields: ['date', 'status'],
  condition: { ownerOnly: true },
  isActive: true,
  createdAt: '2025-07-29T10:00:00.000Z',
  createdBy: 'system',
  updatedAt: '2025-07-29T12:00:00.000Z',
  updatedBy: 'system',
  deletedAt: null,
  deletedBy: null,
  resource: {
    id: '21f6cf8e-7e15-430a-abe9-f2b3f0cb5f45',
    name: 'appointment',
    description: 'Appointment entity resource',
    isActive: true,
    createdAt: '2025-07-20T08:00:00.000Z',
    createdBy: 'system',
    updatedAt: '2025-07-21T10:00:00.000Z',
    updatedBy: 'system',
    deletedAt: null,
    deletedBy: null,
  },
  permissionActions: [
    {
      id: '9cadd960-df71-4a0d-94e1-7edc8f118d2a',
      isActive: true,
      createdAt: '2025-07-29T10:01:00.000Z',
      createdBy: 'system',
      updatedAt: '2025-07-29T10:01:00.000Z',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      permission: { id: 'd8d5d735-7722-4be4-8be0-1cd1d9349e61' },
      action: {
        id: 'a1e2f3d4-5678-90ab-cdef-1234567890ab',
        name: 'create',
        description: 'Create an entity',
        isActive: true,
        createdAt: '2025-07-10T09:00:00.000Z',
        createdBy: 'admin',
        updatedAt: '2025-07-10T09:30:00.000Z',
        updatedBy: 'admin',
        deletedAt: null,
        deletedBy: null,
      },
    },
    {
      id: 'b7acffe9-4636-4bc1-bdee-4d6e5672c5b2',
      isActive: true,
      createdAt: '2025-07-29T10:02:00.000Z',
      createdBy: 'system',
      updatedAt: '2025-07-29T10:02:00.000Z',
      updatedBy: 'system',
      deletedAt: null,
      deletedBy: null,
      permission: { id: 'd8d5d735-7722-4be4-8be0-1cd1d9349e61' },
      action: {
        id: 'a2e3f4d5-6789-01bc-def0-2345678901bc',
        name: 'delete',
        description: 'Delete an entity',
        isActive: true,
        createdAt: '2025-07-10T09:05:00.000Z',
        createdBy: 'admin',
        updatedAt: '2025-07-10T09:35:00.000Z',
        updatedBy: 'admin',
        deletedAt: null,
        deletedBy: null,
      },
    },
  ],
};

export const permissionListPageDataExample: PermissionListPageData = {
  data: [permissionDataExample],
  total: 1,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'appointment',
  filters: ['active'],
};

export const permissionListResponseExample: PermissionListResponse = {
  status: 'success',
  message: 'Get permission list successful',
  data: permissionListPageDataExample,
};

export const permissionSingleResponseExample: PermissionSingleResponse = {
  status: 'success',
  message: 'Get permission detail successful',
  data: permissionDataExample,
};

export const permissionOptionListResponseExample: PermissionOptionListResponse = {
  status: 'success',
  message: 'Permission options fetched',
  data: [
    {
      id: 'd8d5d735-7722-4be4-8be0-1cd1d9349e61',
      name: 'appointment:[create,delete]@date,status?ownerOnly=true',
    },
  ],
};
