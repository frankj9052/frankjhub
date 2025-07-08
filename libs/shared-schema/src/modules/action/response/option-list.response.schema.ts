import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { actionSchema } from '../entity/schema';

export const actionOptionSchema = actionSchema.pick({
  id: true,
  name: true,
});

export const actionOptionsSchema = z.array(actionOptionSchema);

export const actionOptionListResponseSchema = createSuccessResponseSchema(actionOptionsSchema);

export type ActionOption = zInfer<typeof actionOptionSchema>;
export type ActionOptions = zInfer<typeof actionOptionsSchema>;
export type ActionOptionListResponse = zInfer<typeof actionOptionListResponseSchema>;
