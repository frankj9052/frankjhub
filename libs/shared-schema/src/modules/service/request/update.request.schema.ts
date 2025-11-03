import { zInfer } from '../../../libs/z';
import { serviceSchema, serviceSecretSchema } from '../entities';

export const serviceUpdateRequestSchema = serviceSchema
  .pick({
    name: true,
    baseUrl: true,
    audPrefix: true,
    baselineRequiredScopes: true,
    grantedScopes: true,
    healthCheckPath: true,
    ownerTeam: true,
    description: true,
    isActive: true,
  })
  .partial()
  .extend({
    serviceSecret: serviceSecretSchema.optional(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided to update service'
  );

export type ServiceUpdateRequest = zInfer<typeof serviceUpdateRequestSchema>;
