import { z, zInfer } from '../../../libs/z';
// ---------------------------------------------
// 通用结构
// ---------------------------------------------
export const baseEntitySchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});
export type BaseEntityDto = zInfer<typeof baseEntitySchema>;
