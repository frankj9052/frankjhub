import { createSuccessResponseSchema } from '../../../factories';
import { serviceSchema } from '../entities';
import { z, zInfer } from '../../../libs';

export const serviceDetailSchema = serviceSchema.extend({
  // TODO: 占位，完成routes后引用routesRef或Summary待定
  routes: z.array(z.any()),
});

export const serviceDetailResponseSchema = createSuccessResponseSchema(serviceDetailSchema);

export type ServiceDetail = zInfer<typeof serviceDetailSchema>;

export type ServiceDetailResponse = zInfer<typeof serviceDetailResponseSchema>;
