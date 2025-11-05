import { zInfer } from '../../../libs/z';
import { permissionSchema } from '../entity/permission.schema';

export const permissionCreateRequestSchema = permissionSchema
  .pick({
    description: true,
    fields: true,
    condition: true,
    effect: true,
    isActive: true,
  })
  .partial()
  .extend(
    permissionSchema
      .pick({
        resourceId: true,
        actionId: true,
      })
      .required().shape
  )
  .strict();

export type PermissionCreateRequest = zInfer<typeof permissionCreateRequestSchema>;
