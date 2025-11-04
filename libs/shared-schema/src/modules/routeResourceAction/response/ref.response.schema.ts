import { zInfer } from '../../../libs';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { routeResourceActionSchema } from '../entity';

export const routeResourceActionRefSchema = routeResourceActionSchema.pick({
  id: true,
  routeId: true,
  resourceId: true,
  actionId: true,
});

export const routeResourceActionRefResponseSchema = createSuccessResponseSchema(
  routeResourceActionRefSchema
);

export type RouteResourceActionRef = zInfer<typeof routeResourceActionRefSchema>;
export type RouteResourceActionRefResponse = zInfer<typeof routeResourceActionRefResponseSchema>;
