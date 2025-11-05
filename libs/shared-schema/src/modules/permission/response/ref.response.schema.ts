import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { permissionSchema } from '../entity/permission.schema';
import { zInfer } from '../../../libs';

export const permissionRefSchema = permissionSchema.pick({
  id: true,
  name: true,
});

export const permissionRefResponseSchema = createSuccessResponseSchema(permissionRefSchema);

export type PermissionRef = zInfer<typeof permissionRefSchema>;
export type PermissionRefResponse = zInfer<typeof permissionRefResponseSchema>;
