import { z, zInfer } from '../../../libs/z';
import { roleSchema } from '../entity';

export const roleUpdateRequestSchema = z
  .object({
    id: roleSchema.shape.id,
  })
  .extend(
    roleSchema
      .pick({
        name: true,
        description: true,
        isActive: true,
        roleSource: true,
      })
      .partial().shape
  )
  .extend({
    sourceId: z.string().uuid().optional(),
    permissionIds: z.array(z.string().uuid()).optional(),
  });

export type RoleUpdateRequest = zInfer<typeof roleUpdateRequestSchema>;
