import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { resourceRefSchema } from '../../../modules/resource';
import { actionRefSchema } from 'src/modules/action';

export const permissionSchema = z.object({
  ...baseEntitySchema.shape,
  name: z.string().max(512),
  description: z.string().max(255).optional().nullable(),
  fields: z.array(z.string()).optional().nullable(),
  condition: z.record(z.unknown()).optional().nullable(),
  resource: resourceRefSchema,
  actions: z.array(actionRefSchema),
});

export const permissionRefSchema = permissionSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type PermissionDto = zInfer<typeof permissionSchema>;
export type permissionRef = zInfer<typeof permissionRefSchema>;
