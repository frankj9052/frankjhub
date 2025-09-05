import { z, zInfer } from '../../../libs/z';

export const userOrganizationRoleDeleteRequestSchema = z.object({
  userId: z.string().uuid(),
  orgnizationId: z.string().uuid(),
  roleId: z.string().uuid().optional(),
});

export type UserOrganizationRoleDeleteRequest = zInfer<
  typeof userOrganizationRoleDeleteRequestSchema
>;
