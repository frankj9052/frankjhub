import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common/entity/baseEntity.schema';
import { actionSchema } from '../../../modules/action/entity/schema';

export const permissionActionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  action: actionSchema,
  permission: z.object({ id: z.string().uuid() }), // 避免循环引用
  isActive: z.boolean().default(true).optional(),
});

export type PermissionActionDto = zInfer<typeof permissionActionSchema>;
