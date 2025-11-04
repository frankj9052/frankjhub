import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { scopeRefSchema } from './ref.response.schema';

export const scopeOptionSchema = scopeRefSchema;
export const scopeOptionListSchema = z.array(scopeOptionSchema);
export const scopeOptionListResponseSchema = createSuccessResponseSchema(scopeOptionListSchema);

export type ScopeOption = zInfer<typeof scopeOptionSchema>;
export type ScopeOptionList = zInfer<typeof scopeOptionListSchema>;
export type ScopeOptionListResponse = zInfer<typeof scopeOptionListResponseSchema>;
