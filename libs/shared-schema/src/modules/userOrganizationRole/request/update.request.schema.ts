import { z, zInfer } from '../../../libs/z';

export const userOrganizationRoleUpdateRequestSchema = z
  .object({
    id: z.string().uuid(),
    organizations: z
      .array(
        z
          .object({
            id: z.string().uuid(),
            roles: z
              .array(
                z
                  .object({
                    id: z.string().uuid(),
                  })
                  .strict()
              )
              .min(1, 'At least one role'),
          })
          .strict()
      )
      .min(1, 'At least one organization'),
  })
  .strict();

export type UserOrganizationRoleUpdateRequest = zInfer<
  typeof userOrganizationRoleUpdateRequestSchema
>;
