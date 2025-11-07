import { zInfer } from '../../../libs';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { routeScopeSchema } from '../entity';

export const routeScopeRefSchema = routeScopeSchema.pick({
  id: true,
  scopeKey: true,
});

export const routeScopeRefResponseSchema = createSuccessResponseSchema(routeScopeRefSchema);

export type RouteScopeRef = zInfer<typeof routeScopeRefSchema>;
export type RouteScopeRefResponse = zInfer<typeof routeScopeRefResponseSchema>;
