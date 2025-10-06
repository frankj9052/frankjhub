import { z, zInfer } from '../../../libs/z';
import { serviceSchema, serviceSecretSchema } from '../entities';
import { serviceCreateRequestSchema } from './create.request.schema';

export const serviceUpdateRequestSchema = z
  .object({
    id: serviceSchema.shape.id,
  })
  .extend(serviceCreateRequestSchema.partial().shape)
  .extend({
    serviceSecret: serviceSecretSchema.optional(),
  });

export type ServiceUpdateRequest = zInfer<typeof serviceUpdateRequestSchema>;
