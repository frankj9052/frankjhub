import { z, zInfer } from '../../../libs/z';
import { permissionSchema } from '../entity';

export const permissionUpdateRequestSchema = z
  .object({
    id: permissionSchema.shape.id, // 必须传入 id 才能更新
  })
  .extend(
    permissionSchema
      .pick({
        description: true,
        fields: true,
        condition: true,
        isActive: true,
      })
      .partial().shape
  )
  .extend({
    // 可选传入新的 resourceId 或 actionIds，用于更新关联关系
    resourceId: z.string().uuid().optional(),
    actionIds: z.array(z.string().uuid()).optional(),
  });

export type PermissionUpdateRequest = zInfer<typeof permissionUpdateRequestSchema>;
