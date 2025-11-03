import { zInfer } from '../../../libs';
import { serviceRouteSchema } from '../entity';

export const serviceRouteCreateRequestSchema = serviceRouteSchema
  .pick({
    routeRuleType: true,
    rewrite: true,
    rateLimit: true,
    isActive: true,
  })
  .partial()
  .extend(
    serviceRouteSchema
      .pick({
        serviceId: true,
        path: true,
        methods: true,
      })
      .required().shape
  )
  .strict();

export type ServiceRouteCreateRequest = zInfer<typeof serviceRouteCreateRequestSchema>;
