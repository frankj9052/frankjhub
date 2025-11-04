import { zInfer } from '../../../libs/z';
import { routeResourceActionSchema } from '../entity/routeResourceAction.schema';

export const routeResourceActionUpdateRequestSchema = routeResourceActionSchema
  .pick({
    actionId: true,
  })
  .refine(v => v.actionId, {
    message: 'No-op update: nothing to change',
  });

export type RouteResourceActionUpdateRequest = zInfer<
  typeof routeResourceActionUpdateRequestSchema
>;
