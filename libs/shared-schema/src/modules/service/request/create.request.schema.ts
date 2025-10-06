import { zInfer } from '../../../libs/z';
import { serviceSchema, serviceSecretSchema } from '../entities';

export const serviceCreateRequestSchema = serviceSchema
  .pick({
    serviceId: true,
    name: true,
    baseUrl: true,
    audPrefix: true,
    routes: true,
    requiredScopes: true,
    healthCheckPath: true,
    ownerTeam: true,
    description: true,
  })
  .extend({
    serviceSecret: serviceSecretSchema,
  });

export type ServiceCreateRequest = zInfer<typeof serviceCreateRequestSchema>;
