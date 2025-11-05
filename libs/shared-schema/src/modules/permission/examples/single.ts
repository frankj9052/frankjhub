import { PermissionDetail, PermissionRef, PermissionSummary } from '../response';

export const permissionRefData: PermissionRef = {
  id: 'a3f1c2e4-5b6d-47f2-8c1d-123456789abc',
  name: 'main.user:[read]@name,email?orgId=123',
};

export const permissionSummaryData: PermissionSummary = {
  id: 'f1a3b7d2-4e5c-42b1-9a8e-6f2c7d4b1a5f',
  name: 'main.user:[read]@name,email?orgId=123',
  effect: 'allow',
  isActive: true,
  createdAt: '2025-11-05T14:30:00.000Z',
  updatedAt: '2025-11-05T15:00:00.000Z',
  deletedAt: null,
};

export const permissionDetailData: PermissionDetail = {
  id: 'f1a3b7d2-4e5c-42b1-9a8e-6f2c7d4b1a5f',
  name: 'user_management.User:[READ]@name,email?orgId=123',
  description: 'Allow reading user name and email under specific orgId',
  fieldsHash: 'abc123def456',
  conditionHash: 'xyz789ghi012',
  resourceId: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
  actionId: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
  actionName: 'READ',
  effect: 'allow',
  isActive: true,
  version: 1,
  createdAt: '2025-11-05T14:30:00.000Z',
  updatedAt: '2025-11-05T15:00:00.000Z',
  deletedAt: null,
  resource: {
    id: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
    createdAt: '2025-09-20T08:00:00.000Z',
    updatedAt: '2025-10-05T08:00:00.000Z',
    deletedAt: null,
    isActive: true,
    namespace: 'user_management',
    entity: 'User',
    qualifier: ':id',
    fieldsMode: 'whitelist',
    fields: ['name', 'email'],
    resource_key: 'user_management.User',
  },
  action: {
    id: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
    name: 'READ',
    displayName: 'Read',
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
  condition: {
    orgId: 123,
    department: 'engineering',
    minRoleLevel: 2,
  },
};
