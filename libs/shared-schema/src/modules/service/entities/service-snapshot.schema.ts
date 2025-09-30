import { z, zInfer } from '../../../libs/z';
import { serviceSchema } from './service.schema';

export const serviceSnapshotEntry = z.object({
  key: serviceSchema.shape.serviceId,
  aud: z.string(),
  baseUrl: serviceSchema.shape.baseUrl,
  requiredScopes: serviceSchema.shape.requiredScopes,
  routes: serviceSchema.shape.routes,
});

export const serviceSnapshotSchema = z.array(serviceSnapshotEntry);

export type ServiceSnapshotEntry = zInfer<typeof serviceSnapshotEntry>;
export type ServiceSnapshot = zInfer<typeof serviceSnapshotSchema>;
