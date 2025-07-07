import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { actionSchema } from '../entity/schema';

export const actionOptionSchema = actionSchema.pick({
  id: true,
  name: true,
});

export const actionOptionsSchema = z.array(actionOptionSchema);

export const actionOptionListResponseSchema = createSuccessResponseSchema(actionOptionsSchema);

export type ActionOptionSchema = zInfer<typeof actionOptionSchema>;
export type ActionOptionsSchema = zInfer<typeof actionOptionsSchema>;
export type ActionOptionListResponse = zInfer<typeof actionOptionListResponseSchema>;
