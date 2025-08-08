import { baseEntitySchema } from '../../../modules/common/entity/baseEntity.schema';
import { z, zInfer } from '../../../libs/z';
import { RoleSource } from '../../../enums/roleSource.enum';
import { organizationTypeSchema } from '../../../modules/organizationType';
import { organizationSchema } from '../../../modules/organization';
import { rolePermissionSchema } from '../../../modules/rolePermission/entity/schema';
import { permissionSchema } from '../../../modules/permission';

export const roleSchema = z.object({
  ...baseEntitySchema.shape,
  code: z.string().max(255),
  name: z.string().max(50),
  description: z.string().max(255).default(''),
  roleSource: z.nativeEnum(RoleSource).default(RoleSource.TYPE).optional(),
  organizationType: organizationTypeSchema
    .pick({
      id: true,
      name: true,
      description: true,
    })
    .optional(),
  organization: organizationSchema
    .pick({
      id: true,
      name: true,
      description: true,
      orgTypeId: true,
      orgTypeName: true,
    })
    .optional(),
  rolePermissions: z
    .array(
      rolePermissionSchema
        .pick({
          id: true,
          name: true,
        })
        .extend({
          permission: permissionSchema.pick({
            id: true,
            name: true,
            description: true,
          }),
        })
    )
    .optional(),
});

export type RoleDto = zInfer<typeof roleSchema>;
