import { zInfer } from '../../../libs/z';
import { routeScopeSchema } from '../entity/routeScope.schema';

export const routeScopeCreateRequestSchema = routeScopeSchema
  .pick({
    routeId: true,
    scopeId: true,
  })
  .strict();

export type RouteScopeCreateRequest = zInfer<typeof routeScopeCreateRequestSchema>;
