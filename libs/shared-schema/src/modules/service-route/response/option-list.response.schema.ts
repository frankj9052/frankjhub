import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { serviceRouteRefSchema } from './ref.response.schema';
import { z, zInfer } from '../../../libs/z';

export const serviceRouteOptionSchema = serviceRouteRefSchema;
export const serviceRouteOptionListSchema = z.array(serviceRouteOptionSchema);
export const serviceRouteOptionListResponseSchema = createSuccessResponseSchema(
  serviceRouteOptionListSchema
);

export type ServiceRouteOption = zInfer<typeof serviceRouteOptionSchema>;
export type ServiceRouteOptionList = zInfer<typeof serviceRouteOptionListSchema>;
export type ServiceRouteOptionListResponse = zInfer<typeof serviceRouteOptionListResponseSchema>;
