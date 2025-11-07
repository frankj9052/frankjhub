import { serviceRouteSummarySchema } from '../../../modules/service-route/response/summary.response.schema';
import { routeScopeSchema } from '../entity/routeScope.schema';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';
import { scopeSummarySchema } from '../../../modules/scope/response/summary.response.schema';

export const routeScopeDetailSchema = routeScopeSchema.extend({
  route: serviceRouteSummarySchema,
  scope: scopeSummarySchema,
});

export const routeScopeDetailResponseSchema = createSuccessResponseSchema(routeScopeDetailSchema);

export type RouteScopeDetail = zInfer<typeof routeScopeDetailSchema>;
export type RouteScopeDetailResponse = zInfer<typeof routeScopeDetailResponseSchema>;
