import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { permissionSchema } from '../entity/permission.schema';

export const permissionOptionSchema = permissionSchema.pick({
  id: true,
  name: true,
});

export const permissionOptionListSchema = z.array(permissionOptionSchema);

export const permissionOptionListResponseSchema = createSuccessResponseSchema(
  permissionOptionListSchema
);

export type PermissionOption = zInfer<typeof permissionOptionSchema>;
export type PermissionOptionList = zInfer<typeof permissionOptionListSchema>;
export type PermissionOptionListResponse = zInfer<typeof permissionOptionListResponseSchema>;
