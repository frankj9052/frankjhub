import { zInfer } from '../../../libs/z';
import { rolePermissionSchema } from '../entity/schema';

export const rolePermissionUpdateRequestSchema = rolePermissionSchema
  .pick({
    isActive: true,
  })
  .partial()
  .strict()
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided to update rolePermission'
  );

export type RolePermissionUpdateRequest = zInfer<typeof rolePermissionUpdateRequestSchema>;
