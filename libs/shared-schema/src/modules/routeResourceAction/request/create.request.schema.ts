import { zInfer } from '../../../libs/z';
import { routeResourceActionSchema } from '../entity';

export const routeResourceActionCreateRequestSchema = routeResourceActionSchema
  .pick({
    routeId: true,
    resourceId: true,
    actionId: true,
  })
  .strict();

export type RouteResourceActionCreateRequest = zInfer<
  typeof routeResourceActionCreateRequestSchema
>;
