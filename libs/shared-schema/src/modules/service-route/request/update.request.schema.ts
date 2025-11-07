import { zInfer } from '../../../libs/z';
import { serviceRouteSchema } from '../entity/service-route.schema';

export const serviceRouteUpdateRequestSchema = serviceRouteSchema
  .pick({
    path: true,
    routeRuleType: true,
    methods: true,
    rewrite: true,
    rateLimit: true,
    isActive: true,
    authMode: true,
  })
  .partial()
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided to update service'
  );

export type ServiceRouteUpdateRequest = zInfer<typeof serviceRouteUpdateRequestSchema>;
