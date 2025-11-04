import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs';
import { idSchema } from '../../../modules/common/entity/id.schema';
import { actionNameSchema } from '../../../modules/action';
import { scopeKeySchema } from './fields/key.schema';

export const scopeSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  resourceId: idSchema,
  actionId: idSchema,
  actionName: actionNameSchema,
  key: scopeKeySchema,
});

export type ScopeDto = zInfer<typeof scopeSchema>;
