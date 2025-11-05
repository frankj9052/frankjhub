import { serviceRouteSummarySchema } from '../../../modules/service-route';
import { routeResourceActionSchema } from '../entity';
import { resourceSummarySchema } from '../../../modules/resource';
import { actionSummarySchema } from '../../../modules/action';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';

export const routeResourceActionDetailSchema = routeResourceActionSchema.extend({
  route: serviceRouteSummarySchema,
  resource: resourceSummarySchema,
  action: actionSummarySchema,
});

export const routeResourceActionDetailResponseSchema = createSuccessResponseSchema(
  routeResourceActionDetailSchema
);

export type RouteResourceActionDetail = zInfer<typeof routeResourceActionDetailSchema>;
export type RouteResourceActionDetailResponse = zInfer<
  typeof routeResourceActionDetailResponseSchema
>;
