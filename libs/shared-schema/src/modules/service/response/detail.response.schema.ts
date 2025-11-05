import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { serviceSchema } from '../entities/service.schema';
import { z, zInfer } from '../../../libs/z';
import { serviceRouteSummarySchema } from 'src/modules/service-route/response/summary.response.schema';

export const serviceDetailSchema = serviceSchema.extend({
  routes: z.array(serviceRouteSummarySchema),
});

export const serviceDetailResponseSchema = createSuccessResponseSchema(serviceDetailSchema);

export type ServiceDetail = zInfer<typeof serviceDetailSchema>;

export type ServiceDetailResponse = zInfer<typeof serviceDetailResponseSchema>;
