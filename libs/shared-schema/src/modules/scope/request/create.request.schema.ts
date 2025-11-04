import { zInfer } from '../../../libs';
import { scopeSchema } from '../entity';

export const scopeCreateRequestSchema = scopeSchema
  .pick({
    resourceId: true,
    actionId: true,
  })
  .strict();

export type ScopeCreateRequest = zInfer<typeof scopeCreateRequestSchema>;
