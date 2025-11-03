import { serviceRouteSchema } from '../entity';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs/z';

export const serviceRouteRefSchema = serviceRouteSchema.pick({
  id: true,
  path: true,
});

export const serviceRouteRefResponseSchema = createSuccessResponseSchema(serviceRouteRefSchema);

export type ServiceRouteRef = zInfer<typeof serviceRouteRefSchema>;
export type ServiceRouteRefResponse = zInfer<typeof serviceRouteRefResponseSchema>;
