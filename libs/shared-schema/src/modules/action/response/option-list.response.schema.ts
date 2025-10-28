import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { actionRefSchema } from './ref.response.schema';

export const actionOptionSchema = actionRefSchema;

export const actionOptionListSchema = z.array(actionOptionSchema);

export const actionOptionListResponseSchema = createSuccessResponseSchema(actionOptionListSchema);

export type ActionOption = zInfer<typeof actionOptionSchema>;
export type ActionOptionList = zInfer<typeof actionOptionListSchema>;
export type ActionOptionListResponse = zInfer<typeof actionOptionListResponseSchema>;
