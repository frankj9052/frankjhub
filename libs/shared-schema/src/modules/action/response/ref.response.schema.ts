import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';
import { baseActionSchema } from '../entity';

export const actionRefSchema = baseActionSchema.pick({
  id: true,
  name: true,
  displayName: true,
});

export const actionRefResponseSchema = createSuccessResponseSchema(actionRefSchema);

export type ActionRef = zInfer<typeof actionRefSchema>;
export type ActionRefResponse = zInfer<typeof actionRefResponseSchema>;
