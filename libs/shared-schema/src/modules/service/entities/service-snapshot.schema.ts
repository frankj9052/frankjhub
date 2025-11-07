import { serviceRouteDetailSchema } from '../../../modules/service-route/response/detail.response.schema';
import { z, zInfer } from '../../../libs/z';
import { serviceSchema } from './service.schema';
import { scopeKeySchema } from '../../../modules/scope/entity/fields/scopeKey.schema';

export const serviceSnapshotRouteSchema = serviceRouteDetailSchema
  .pick({
    path: true,
    routeRuleType: true,
    methods: true,
    rewrite: true,
    rateLimit: true,
    authMode: true,
  })
  .extend({
    scopeKeys: z.array(scopeKeySchema),
  });
export type ServiceSnapshotRoute = zInfer<typeof serviceSnapshotRouteSchema>;

export const serviceSnapshotEntry = z.object({
  key: serviceSchema.shape.serviceId,
  aud: z.string(),
  baseUrl: serviceSchema.shape.baseUrl,
  requiredScopes: serviceSchema.shape.baselineRequiredScopes,
  routes: z.array(serviceSnapshotRouteSchema),
});

export const serviceSnapshotSchema = z.array(serviceSnapshotEntry);

export type ServiceSnapshotEntry = zInfer<typeof serviceSnapshotEntry>;
export type ServiceSnapshot = zInfer<typeof serviceSnapshotSchema>;
