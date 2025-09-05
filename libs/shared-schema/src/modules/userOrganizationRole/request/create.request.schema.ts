import { z, zInfer } from '../../../libs/z';

export const userOrganizationRoleCreateRequestSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export type UserOrganizationRoleCreateRequest = zInfer<
  typeof userOrganizationRoleCreateRequestSchema
>;
