import { zInfer } from '../../../libs/z';
import { serviceSchema, serviceSecretSchema } from '../entities';

export const serviceLoginSchema = serviceSchema
  .pick({
    serviceId: true,
  })
  .extend({
    serviceSecret: serviceSecretSchema,
  });

export type ServiceLogin = zInfer<typeof serviceLoginSchema>;
