import { z, zInfer } from '../../../libs/z';
import { permissionSchema } from '../entity';

export const permissionCreateRequestSchema = permissionSchema
  .pick({
    description: true,
    fields: true,
    condition: true,
  })
  .extend({
    resourceId: z.string().uuid(),
    actionIds: z.array(z.string().uuid()).min(1, 'At least one action must be selected'),
  });

export type PermissionCreateRequest = zInfer<typeof permissionCreateRequestSchema>;
