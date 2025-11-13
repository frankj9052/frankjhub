import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { actionNameSchema } from '../../../modules/action';
import { idSchema } from '../../../modules/common/entity/id.schema';
import {
  permissionConditionHashSchema,
  permissionConditionSchema,
  permissionDescriptionSchema,
  permissionFieldsHashSchema,
  permissionFieldsSchema,
  permissionNameSchema,
} from './fields';
import { permissionEffectSchema } from '../constants/effect.enum';
import { isActiveSchema } from '../../../modules/common/entity/isActive.schema';
import { versionSchema } from '../../../modules/common/entity/version.schema';
import { resourceKeySchema } from '../../../modules/resource';

export const permissionSchema = z.object({
  ...baseEntitySchema.shape,
  id: idSchema,
  name: permissionNameSchema,
  description: permissionDescriptionSchema,
  fields: permissionFieldsSchema.optional(),
  fieldsHash: permissionFieldsHashSchema,
  condition: permissionConditionSchema.optional(),
  conditionHash: permissionConditionHashSchema,
  resourceId: idSchema,
  resource_key: resourceKeySchema,
  actionId: idSchema,
  actionName: actionNameSchema,
  effect: permissionEffectSchema,
  isActive: isActiveSchema,
  version: versionSchema,
});

export type PermissionDto = zInfer<typeof permissionSchema>;
