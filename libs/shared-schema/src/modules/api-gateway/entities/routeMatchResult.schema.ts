import { z, zInfer } from '../../../libs/z';
import { serviceSnapshotEntry } from '../../../modules/service/entities/service-snapshot.schema';

export const routeMatchResultSchema = z.object({
  serviceKey: serviceSnapshotEntry.shape.key,
  target: serviceSnapshotEntry.shape.baseUrl,
  audience: serviceSnapshotEntry.shape.aud,
  requiredScopes: z.array(z.string()),
  rewrite: z.string().optional(),
});

export type RouteMatchResult = zInfer<typeof routeMatchResultSchema>;
