import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { permissionSchema } from '../../../modules/permission';

export const rolePermissionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: z.string().max(512),
  permission: permissionSchema,
  role: z.object({ id: z.string().uuid() }),
  isActive: z.boolean().default(true).optional(),
});

export type RolePermissionDto = zInfer<typeof rolePermissionSchema>;
