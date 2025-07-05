import { z, zInfer } from '../../../libs/z';

export const actionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export const actionOptionSchema = actionSchema.pick({
  id: true,
  name: true,
});

export const actionOptionsSchema = z.array(actionOptionSchema);

export type ActionDto = zInfer<typeof actionSchema>;
export type ActionOptionSchema = zInfer<typeof actionOptionSchema>;
export type ActionOptionsSchema = zInfer<typeof actionOptionsSchema>;
