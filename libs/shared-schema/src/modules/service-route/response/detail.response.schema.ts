import { zInfer } from '../../../libs';
import { createSuccessResponseSchema } from '../../../factories';
import { serviceRouteSchema } from '../entity';

export const serviceRouteDetailSchema = serviceRouteSchema;

export const serviceRouteDetailResponseSchema =
  createSuccessResponseSchema(serviceRouteDetailSchema);

export type ServiceRouteDetail = zInfer<typeof serviceRouteDetailSchema>;
export type ServiceRouteDetailResponse = zInfer<typeof serviceRouteDetailResponseSchema>;
