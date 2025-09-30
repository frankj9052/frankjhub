import { zInfer } from '../../../libs/z';
import { serviceSchema } from '../entities';

export const createServiceRequestSchema = serviceSchema.pick({
  serviceId: true,
  baseUrl: true,
  name: true,
  description: true,
  routes: true,
  requiredScopes: true,
  serviceSecret: true,
});

export type CreateServiceRequest = zInfer<typeof createServiceRequestSchema>;
