import { PermissionCreateRequest } from '../request';

export const permissionCreateRequestData: PermissionCreateRequest = {
  resourceId: 'a1e7c3b9-8f2d-41b5-9a6d-3f2c7b8e4d13',
  actionId: 'e7b6a2c1-3f8d-4a9e-9b7f-1d2c5a8b9e34',
  description: 'Allow updating user information',
  fields: ['name', 'email', 'role'],
  condition: {
    department: 'engineering',
    minRoleLevel: 2,
  },
  effect: 'allow',
  isActive: true,
};
