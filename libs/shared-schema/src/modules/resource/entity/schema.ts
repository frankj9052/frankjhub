import { z, zInfer } from '../../../libs/z';

export const resourceSchema = z.object({
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

export const resourceOptionSchema = resourceSchema.pick({
  id: true,
  name: true,
});

export const resourceOptionsSchema = z.array(resourceOptionSchema);

export type ResourceDto = zInfer<typeof resourceSchema>;
export type ResourceOption = zInfer<typeof resourceOptionSchema>;
export type ResourceOptions = zInfer<typeof resourceOptionsSchema>;
