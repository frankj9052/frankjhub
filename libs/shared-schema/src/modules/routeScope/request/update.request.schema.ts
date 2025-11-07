import { zInfer } from '../../../libs/z';
import { routeScopeSchema } from '../entity/routeScope.schema';

export const routeScopeUpdateRequestSchema = routeScopeSchema
  .pick({
    scopeId: true,
  })
  .refine(v => v.scopeId, {
    message: 'No-op update: nothing to change',
  });

export type RouteScopeUpdateRequest = zInfer<typeof routeScopeUpdateRequestSchema>;
