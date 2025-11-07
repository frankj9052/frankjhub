import { zInfer } from '../../../libs/z';
import { serviceRouteSchema } from '../entity/service-route.schema';

export const serviceRouteUpdateRequestSchema = serviceRouteSchema
  .pick({
    methods: true,
    rateLimit: true,
    isActive: true,
    authMode: true,
  })
  .partial()
  .strict()
  .refine(
    data => Object.keys(data).length > 0,
    'At least one field must be provided to update service'
  );

export type ServiceRouteUpdateRequest = zInfer<typeof serviceRouteUpdateRequestSchema>;
