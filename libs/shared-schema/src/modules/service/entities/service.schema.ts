import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';
import { serviceRouteSchema } from './service-route.schema';
import { serviceSecretSchema } from './service-secret.schema';

export const serviceSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  serviceId: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/i, 'serviceId may only contain letters, numbers, and hyphens (-).'),
  name: z.string(),
  baseUrl: z.string().url('baseUrl must be legal URL'), // 例: http://booking:4001
  audPrefix: z.string().default('api://'),
  routes: z.array(serviceRouteSchema).default([]),
  requiredScopes: z.array(z.string().min(1)).default([]),
  healthCheckPath: z.string().optional(),
  ownerTeam: z.string().optional(),
  serviceSecret: serviceSecretSchema,
  description: z.string().optional(),
  isActive: z.boolean().default(false),
  secretVersion: z.number().int().min(1).default(1),
  lastRotatedAt: z.coerce.date().optional(),
});

export type ServiceDto = zInfer<typeof serviceSchema>;
