import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';

export const actionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export const actionRefSchema = actionSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type ActionDto = zInfer<typeof actionSchema>;
export type ActionRef = zInfer<typeof actionRefSchema>;
