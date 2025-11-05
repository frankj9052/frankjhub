import { PermissionUpdateRequest } from '../request';

export const permissionUpdateRequestData: PermissionUpdateRequest = {
  description: 'Allow updating user email and role',
  fields: ['email', 'role'],
  condition: {
    department: 'engineering',
    minRoleLevel: 2,
  },
  effect: 'allow',
  isActive: true,
  version: 2,
};
