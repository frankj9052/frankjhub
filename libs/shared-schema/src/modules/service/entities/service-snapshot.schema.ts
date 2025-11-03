import { z, zInfer } from '../../../libs/z';
import { serviceDetailSchema } from '../response/detail.response.schema';
import { serviceSchema } from './service.schema';

export const serviceSnapshotEntry = z.object({
  key: serviceSchema.shape.serviceId,
  aud: z.string(),
  baseUrl: serviceSchema.shape.baseUrl,
  requiredScopes: serviceSchema.shape.baselineRequiredScopes,
  routes: serviceDetailSchema.shape.routes,
});

export const serviceSnapshotSchema = z.array(serviceSnapshotEntry);

export type ServiceSnapshotEntry = zInfer<typeof serviceSnapshotEntry>;
export type ServiceSnapshot = zInfer<typeof serviceSnapshotSchema>;
