import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { permissionSchema } from '../../../modules/permission';
import { idSchema } from '../../../modules/common/entity/id.schema';

export const rolePermissionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: z.string().max(512),
  permissionId: idSchema,
  permission: permissionSchema,
  roleId: idSchema,
  role: z.object({ id: z.string().uuid() }),
  isActive: z.boolean().default(true).optional(),
});

export type RolePermissionDto = zInfer<typeof rolePermissionSchema>;
