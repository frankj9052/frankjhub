import { createSuccessResponseSchema } from '../../../factories';
import { serviceSchema } from '../entities/service.schema';
import { zInfer } from '../../../libs';

export const serviceRefSchema = serviceSchema.pick({
  id: true,
  serviceId: true,
  name: true,
});

export const serviceRefResponseSchema = createSuccessResponseSchema(serviceRefSchema);

export type serviceRef = zInfer<typeof serviceRefSchema>;
export type serviceRefResponse = zInfer<typeof serviceRefResponseSchema>;
