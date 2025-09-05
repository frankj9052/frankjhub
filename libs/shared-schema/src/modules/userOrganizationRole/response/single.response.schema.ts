import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { userOrganizationRoleSchema } from '../entity';

export const userOrganizationRoleSingleResponseSchema = createSuccessResponseSchema(
  userOrganizationRoleSchema
);

export type UserOrganizationRoleSingleResponse = zInfer<
  typeof userOrganizationRoleSingleResponseSchema
>;
