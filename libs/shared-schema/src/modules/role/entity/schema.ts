import { baseEntitySchema } from '../../../modules/common/entity/baseEntity.schema';
import { z, zInfer } from '../../../libs/z';
import { RoleSource } from '../../../enums/roleSource.enum';
import { organizationTypeSchema } from '../../../modules/organizationType';
import { organizationSchema } from '../../../modules/organization';
import { rolePermissionSchema } from 'src/modules/rolePermission/entity/schema';

export const roleSchema = z.object({
  ...baseEntitySchema.shape,
  code: z.string().max(255),
  name: z.string().max(50),
  description: z.string().max(255).default(''),
  roleSource: z.nativeEnum(RoleSource).default(RoleSource.TYPE).optional(),
  organizationType: organizationTypeSchema.optional(),
  organization: organizationSchema.optional(),
  rolePermissions: z.array(rolePermissionSchema),
});

export type RoleDto = zInfer<typeof roleSchema>;
