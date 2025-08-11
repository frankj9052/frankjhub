import { resourceRefDataExample } from '../../../modules/resource';
import { PermissionDto, permissionRef } from '../entity';
import { PermissionListPageData, PermissionListResponse } from '../response/list.response.schema';
import { PermissionOptionListResponse } from '../response/option-list.response.schema';
import { PermissionSingleResponse } from '../response/single.response.schema';
import { actionRefDataExample } from 'src/modules/action';

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
  resource: resourceRefDataExample,
  actions: [actionRefDataExample],
};

export const permissionRefDataExample: permissionRef = {
  id: permissionDataExample.id,
  name: permissionDataExample.name,
  description: permissionDataExample.description,
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
