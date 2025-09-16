import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';

export const resourceSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export const resourceRefSchema = resourceSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type ResourceDto = zInfer<typeof resourceSchema>;
export type ResourceRef = zInfer<typeof resourceRefSchema>;
