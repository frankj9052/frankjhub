import { userRefSchema } from '../../../modules/user/entity';
import { z, zInfer } from '../../../libs/z';
import { organizationRefSchema } from '../../../modules/organization';
import { roleRefSchema } from '../../../modules/role';
import { baseEntitySchema } from '../../../modules/common';

export const organizationRoleRefSchema = z.object({
  ...organizationRefSchema.shape,
  roles: z.array(
    roleRefSchema
      .pick({
        id: true,
        code: true,
        name: true,
        description: true,
        roleSource: true,
      })
      .extend({
        userOrganizationRole: baseEntitySchema.optional(),
      })
  ),
});

export const userOrganizationRoleSchema = z.object({
  ...userRefSchema.shape,
  organizations: z.array(organizationRoleRefSchema),
});

export type OrganizationRoleRef = zInfer<typeof organizationRoleRefSchema>;
export type UserOrganizationRoleDto = zInfer<typeof userOrganizationRoleSchema>;
