import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { serviceSchema } from '../entities/service.schema';
import { z, zInfer } from '../../../libs/z';
import { serviceRouteSummarySchema } from '../../../modules/service-route/response/summary.response.schema';
import { resourceSummarySchema } from '../../../modules/resource/response/summary.response.schema';

export const serviceDetailSchema = serviceSchema.extend({
  routes: z.array(serviceRouteSummarySchema),
  resources: z.array(resourceSummarySchema),
});

export const serviceDetailResponseSchema = createSuccessResponseSchema(serviceDetailSchema);

export type ServiceDetail = zInfer<typeof serviceDetailSchema>;

export type ServiceDetailResponse = zInfer<typeof serviceDetailResponseSchema>;
