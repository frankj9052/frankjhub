import { z, zInfer } from '../../../libs/z';
// ---------------------------------------------
// 通用结构
// ---------------------------------------------
export const baseEntitySchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean().default(true).optional(),
  createdAt: z.string(),
  createdBy: z.string().max(255).nullable().optional(),
  updatedAt: z.string(),
  updatedBy: z.string().max(255).nullable().optional(),
  deletedAt: z.string().nullable().optional(),
  deletedBy: z.string().max(255).nullable().optional(),
});
export type BaseEntityDto = zInfer<typeof baseEntitySchema>;
