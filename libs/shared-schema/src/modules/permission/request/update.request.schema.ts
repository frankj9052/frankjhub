import { zInfer } from '../../../libs/z';
import { permissionSchema } from '../entity/permission.schema';

export const permissionUpdateRequestSchema = permissionSchema
  .pick({
    description: true,
    fields: true,
    condition: true,
    effect: true,
    isActive: true,
    version: true,
  })
  .partial();

export type PermissionUpdateRequest = zInfer<typeof permissionUpdateRequestSchema>;
