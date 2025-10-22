import { z, zInfer } from '../../../libs/z';
import { serviceRouteSchema, serviceSchema, serviceSecretSchema } from '../entities';

export const serviceCreateRequestSchema = serviceSchema
  .pick({
    serviceId: true,
    name: true,
    baseUrl: true,
    healthCheckPath: true,
    ownerTeam: true,
    description: true,
  })
  .extend({
    serviceSecret: serviceSecretSchema,
    audPrefix: serviceSchema.shape.audPrefix.optional(),
    routes: z.array(serviceRouteSchema).optional(),
    requiredScopes: serviceSchema.shape.requiredScopes.optional(),
  });

export type ServiceCreateRequest = zInfer<typeof serviceCreateRequestSchema>;
