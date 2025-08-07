import { z, zInfer } from '../../../libs/z';

export const actionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().default(''),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export type ActionDto = zInfer<typeof actionSchema>;
