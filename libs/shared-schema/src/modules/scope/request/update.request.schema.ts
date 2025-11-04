import { zInfer } from '../../../libs';
import { scopeSchema } from '../entity';

export const scopeUpdateRequestSchema = scopeSchema
  .pick({
    actionId: true,
  })
  .partial()
  .refine(v => v.actionId, {
    message: 'No-op update: nothing to change',
  });

export type ScopeUpdateRequest = zInfer<typeof scopeUpdateRequestSchema>;
