import { baseEntitySchema } from '../../../modules/common/entity/baseEntity.schema';
import { z, zInfer } from '../../../libs/z';
import { RoleSource } from '../../../enums/roleSource.enum';
import { organizationTypeRefSchema } from '../../../modules/organizationType';
import { organizationRefSchema } from '../../../modules/organization';
import { permissionRefSchema } from '../../../modules/permission';

export const roleSchema = z.object({
  ...baseEntitySchema.shape,
  code: z.string().max(255),
  name: z.string().max(50),
  description: z.string().max(255).default('').optional(),
  roleSource: z.nativeEnum(RoleSource).default(RoleSource.TYPE).optional(),
  organizationType: organizationTypeRefSchema.optional(),
  organization: organizationRefSchema.optional(),
  permissions: z.array(permissionRefSchema).optional(),
});

export const roleRefSchema = roleSchema.pick({
  id: true,
  code: true,
  name: true,
  description: true,
  roleSource: true,
  organization: true,
  organizationType: true,
  permissions: true,
});

export type RoleDto = zInfer<typeof roleSchema>;
export type RoleRef = zInfer<typeof roleRefSchema>;
