import { createSuccessResponseSchema } from '../../../factories';
import { routeResourceActionSchema } from '../entity';
import { zInfer } from '../../../libs';

export const routeResourceActionSummarySchema = routeResourceActionSchema.pick({
  id: true,
  routeId: true,
  resourceId: true,
  actionId: true,
  actionName: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
});

export const routeResourceActionSummaryResponseSchema = createSuccessResponseSchema(
  routeResourceActionSummarySchema
);

export type RouteResourceActionSummary = zInfer<typeof routeResourceActionSummarySchema>;
export type RouteResourceActionSummaryResponse = zInfer<
  typeof routeResourceActionSummaryResponseSchema
>;
