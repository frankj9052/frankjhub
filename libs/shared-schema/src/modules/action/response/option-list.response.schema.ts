import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { actionSchema } from '../entity/schema';

export const actionOptionSchema = actionSchema.pick({
  id: true,
  name: true,
});

export const actionOptionListSchema = z.array(actionOptionSchema);

export const actionOptionListResponseSchema = createSuccessResponseSchema(actionOptionListSchema);

export type ActionOption = zInfer<typeof actionOptionSchema>;
export type ActionOptionList = zInfer<typeof actionOptionListSchema>;
export type ActionOptionListResponse = zInfer<typeof actionOptionListResponseSchema>;
