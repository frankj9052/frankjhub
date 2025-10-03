import { zInfer } from '../../../libs/z';
import { serviceSchema } from '../entities';

export const serviceLoginSchema = serviceSchema.pick({
  serviceId: true,
  serviceSecret: true,
});

export type ServiceLogin = zInfer<typeof serviceLoginSchema>;
