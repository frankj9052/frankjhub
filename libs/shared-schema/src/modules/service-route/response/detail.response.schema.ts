import { z, zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { serviceRouteSchema } from '../entity/service-route.schema';
import { routeScopeSummarySchema } from '../../../modules/routeScope/response/summary.response.schema';
import { serviceSummarySchema } from '../../../modules/service/response/summary.response.schema';

export const serviceRouteDetailSchema = serviceRouteSchema.extend({
  scopes: z.array(routeScopeSummarySchema),
  service: serviceSummarySchema,
});

export const serviceRouteDetailResponseSchema =
  createSuccessResponseSchema(serviceRouteDetailSchema);

export type ServiceRouteDetail = zInfer<typeof serviceRouteDetailSchema>;
export type ServiceRouteDetailResponse = zInfer<typeof serviceRouteDetailResponseSchema>;
