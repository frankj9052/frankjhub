import { z, zInfer } from '../../../libs/z';

export const resourceSchema = z.object({
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

export const resourceRefSchema = resourceSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type ResourceDto = zInfer<typeof resourceSchema>;
export type ResourceRef = zInfer<typeof resourceRefSchema>;
