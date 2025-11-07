import { zInfer } from '../../../libs';
import { serviceRouteSchema } from './service-route.schema';

// 验证唯一用
export const serviceRouteCompositeSchema = serviceRouteSchema.pick({
  serviceId: true,
  path: true,
  routeRuleType: true,
  rewrite: true,
});

export type ServiceRouteComposite = zInfer<typeof serviceRouteCompositeSchema>;
