import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs';
import { idSchema } from '../../../modules/common/entity/id.schema';
import { serviceIdSchema } from '../../../modules/service/entities/fields/serviceId.schema';
import { pathSchema } from './fields/path.schema';
import { methodsSchema } from './fields/methods.schema';
import { rewriteSchema } from './fields/rewrite.schema';
import { rateLimitSchema } from './fields/rateLimit.schema';
import { isActiveSchema } from '../../../modules/common/entity/isActive.schema';
import { AuthModeSchema, routeRuleTypeSchema } from '../constants';

/** Core entity DTO (internal usage). */
export const serviceRouteSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  serviceId: serviceIdSchema,
  path: pathSchema,
  routeRuleType: routeRuleTypeSchema,
  methods: methodsSchema,
  rewrite: rewriteSchema,
  rateLimit: rateLimitSchema,
  isActive: isActiveSchema,
  authMode: AuthModeSchema,
});

export type ServiceRoute = zInfer<typeof serviceRouteSchema>;
