import { createSuccessResponseSchema } from '../../../factories';
import { serviceSchema } from '../entities';
import { z, zInfer } from '../../../libs';
import { serviceRouteSummarySchema } from 'src/modules/service-route/response/summary.response.schema';

export const serviceDetailSchema = serviceSchema.extend({
  routes: z.array(serviceRouteSummarySchema),
});

export const serviceDetailResponseSchema = createSuccessResponseSchema(serviceDetailSchema);

export type ServiceDetail = zInfer<typeof serviceDetailSchema>;

export type ServiceDetailResponse = zInfer<typeof serviceDetailResponseSchema>;
