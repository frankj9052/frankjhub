import { idSchema } from 'src/modules/common/entity/id.schema';
import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';
import {
  serviceAudPrefixSchema,
  serviceBaselineRequiredScopesSchema,
  serviceBaseUrlSchema,
  serviceDescriptionSchema,
  serviceGrantedScopesSchema,
  serviceHealthCheckPathSchema,
  serviceIdSchema,
  serviceLastRotatedAtSchema,
  serviceNameSchema,
  serviceSecretSchema,
} from './fields';
import { serviceOwnerTeamSchema } from './fields/ownerTeam.schema';
import { isActiveSchema } from '../../../modules/common/entity/isActive.schema';

export const serviceSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  serviceId: serviceIdSchema,
  name: serviceNameSchema,
  baseUrl: serviceBaseUrlSchema,
  audPrefix: serviceAudPrefixSchema,
  baselineRequiredScopes: serviceBaselineRequiredScopesSchema,
  grantedScopes: serviceGrantedScopesSchema,
  healthCheckPath: serviceHealthCheckPathSchema,
  ownerTeam: serviceOwnerTeamSchema,
  description: serviceDescriptionSchema,
  isActive: isActiveSchema,
  secretVersion: serviceSecretSchema,
  lastRotatedAt: serviceLastRotatedAtSchema,
});

export type ServiceDto = zInfer<typeof serviceSchema>;
