import { z, zInfer } from '../../../libs/z';

export const actionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export const actionRefSchema = actionSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type ActionDto = zInfer<typeof actionSchema>;
export type ActionRef = zInfer<typeof actionRefSchema>;
