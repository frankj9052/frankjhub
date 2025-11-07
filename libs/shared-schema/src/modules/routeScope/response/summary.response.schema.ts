import { createSuccessResponseSchema } from '../../../factories';
import { routeScopeSchema } from '../entity';
import { zInfer } from '../../../libs';

export const routeScopeSummarySchema = routeScopeSchema.pick({
  id: true,
  routeId: true,
  scopeId: true,
  scopeKey: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
});

export const routeScopeSummaryResponseSchema = createSuccessResponseSchema(routeScopeSummarySchema);

export type RouteScopeSummary = zInfer<typeof routeScopeSummarySchema>;
export type RouteScopeSummaryResponse = zInfer<typeof routeScopeSummaryResponseSchema>;
