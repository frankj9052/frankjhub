import { zInfer } from '../../../libs/z';
import { rolePermissionSchema } from '../entity/schema';

export const rolePermissionCreateRequestSchema = rolePermissionSchema.pick({
  permissionId: true,
  roleId: true,
  isActive: true,
});

export type RolePermissionCreateRequest = zInfer<typeof rolePermissionCreateRequestSchema>;
