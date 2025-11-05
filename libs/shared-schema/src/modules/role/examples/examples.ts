import { RoleDto, RoleRef } from '../entity';
import { RoleListPageData, RoleListResponse } from '../response/list.response.schema';
import { RoleSingleResponse } from '../response/single.response.schema';
import { RoleOptionListResponse } from '../response/option-list.response.schema';
import { RoleSource } from '../../../enums';
import { organizationRefDataExample } from '../../../modules/organization/examples/examples';
import { permissionRefData } from '../../../modules/permission';

export const roleDataExample: RoleDto = {
  id: '6b7f4e8d-1234-4cde-9abc-9876543210ff',
  code: 'org|bb9c12e3-4567-4abc-bcde-9876543210aa::administrator',
  name: 'administrator',
  description: 'Full access to all system operations.',
  roleSource: RoleSource.ORG,
  isActive: true,
  createdAt: '2025-07-30T09:00:00.000Z',
  createdBy: 'system',
  updatedAt: '2025-07-30T12:00:00.000Z',
  updatedBy: 'system',
  deletedAt: null,
  deletedBy: null,
  organization: organizationRefDataExample,
  organizationType: undefined,
  permissions: [permissionRefData],
};

export const roleRefDataExample: RoleRef = {
  id: roleDataExample.id,
  code: roleDataExample.code,
  name: roleDataExample.name,
  description: roleDataExample.description,
  roleSource: roleDataExample.roleSource,
  organization: roleDataExample.organization,
  organizationType: roleDataExample.organizationType,
  permissions: roleDataExample.permissions,
};

export const roleListPageDataExample: RoleListPageData = {
  data: [roleDataExample],
  total: 1,
  pageCount: 1,
  currentPage: 1,
  pageSize: 10,
  search: 'admin',
  filters: ['active'],
};

export const roleListResponseExample: RoleListResponse = {
  status: 'success',
  message: 'Get role list successful',
  data: roleListPageDataExample,
};

export const roleSingleResponseExample: RoleSingleResponse = {
  status: 'success',
  message: 'Get role detail successful',
  data: roleDataExample,
};

export const roleOptionListResponseExample: RoleOptionListResponse = {
  status: 'success',
  message: 'Role options fetched',
  data: [
    {
      id: '6b7f4e8d-1234-4cde-9abc-9876543210ff',
      name: 'administrator',
      code: 'org|bb9c12e3-4567-4abc-bcde-9876543210aa::administrator',
    },
    {
      id: '7c8e9a1b-5678-4def-a012-abcdefabcdef',
      name: 'manager',
      code: 'org|bb9c12e3-4567-4abc-bcde-9876543210aa::manager',
    },
    {
      id: '8d9f0b2c-6789-4fed-b123-bcdefabcdefa',
      name: 'assistant',
      code: 'orgType|22aa33bb-ccdd-eeff-aabb-112233445566::assistant',
    },
  ],
};
