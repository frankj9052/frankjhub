import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common/entity/baseEntity.schema';
import { actionSchema } from '../../../modules/action/entity/schema';

export const permissionActionSchema = z.object({
  ...baseEntitySchema.shape,
  action: actionSchema,
  permission: z.object({ id: z.string().uuid() }), // 避免循环引用
});

export type PermissionActionDto = zInfer<typeof permissionActionSchema>;
