import { zInfer } from '../../../libs/z';
import { serviceSchema } from '../entities';
import { serviceSecretSchema } from '../entities/fields/serviceSecret.schema';

export const serviceCreateRequestSchema = serviceSchema
  .pick({
    audPrefix: true,
    baselineRequiredScopes: true,
    grantedScopes: true,
    healthCheckPath: true,
    ownerTeam: true,
    description: true,
    isActive: true,
  })
  .partial()
  .extend(
    serviceSchema
      .pick({
        serviceId: true,
        name: true,
        baseUrl: true,
      })
      .required().shape
  )
  .extend({
    serviceSecret: serviceSecretSchema,
  })
  .strict();

export type ServiceCreateRequest = zInfer<typeof serviceCreateRequestSchema>;
