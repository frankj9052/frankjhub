import { PermissionCreateRequest } from '../request';

export const permissionCreateRequestData: PermissionCreateRequest = {
  resource_key: 'main.invitation',
  actionName: 'create',
  description: 'Allow updating user information',
  fields: ['name', 'email', 'role'],
  condition: {
    department: 'engineering',
    minRoleLevel: 2,
  },
  effect: 'allow',
  isActive: true,
};
