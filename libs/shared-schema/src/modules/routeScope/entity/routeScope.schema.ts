import { scopeKeySchema } from 'src/modules/scope/entity/fields/scopeKey.schema';
import { z, zInfer } from '../../../libs';
import { baseEntitySchema } from '../../../modules/common';
import { idSchema } from '../../../modules/common/entity/id.schema';

export const routeScopeSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  routeId: idSchema,
  scopeId: idSchema,
  scopeKey: scopeKeySchema,
});

export type RouteScopeDto = zInfer<typeof routeScopeSchema>;
