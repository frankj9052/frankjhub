import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { scopeSchema } from '../entity';

export const scopeRefSchema = scopeSchema.pick({
  id: true,
  key: true,
});

export const scopeRefResponseSchema = createSuccessResponseSchema(scopeRefSchema);

export type ScopeRef = zInfer<typeof scopeRefSchema>;
export type ScopeRefResponse = zInfer<typeof scopeRefResponseSchema>;
