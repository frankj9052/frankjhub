import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { resourceSchema } from '../../../modules/resource';
import { permissionActionSchema } from '../../../modules/permission-action';

export const permissionSchema = z.object({
  ...baseEntitySchema.shape,
  name: z.string().max(512),
  description: z.string().max(255).optional().nullable(),
  fields: z.array(z.string()).optional().nullable(),
  condition: z.record(z.unknown()).optional().nullable(),
  resource: resourceSchema,
  permissionActions: z.array(permissionActionSchema),
});

export type PermissionDto = zInfer<typeof permissionSchema>;
