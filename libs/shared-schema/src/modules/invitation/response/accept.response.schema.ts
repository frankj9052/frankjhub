import { z, zInfer } from '../../../libs/z';
import { invitationSchema } from '../entity';
import { createSuccessResponseSchema } from '../../../factories';

export const acceptInvitationDataSchema = invitationSchema
  .pick({
    organizationId: true,
    targetRoleId: true,
  })
  .extend({
    invitationId: z.string().uuid(),
  });
export const acceptInvitationResponseSchema = createSuccessResponseSchema(
  acceptInvitationDataSchema
);

export type AcceptInvitationData = zInfer<typeof acceptInvitationDataSchema>;
export type AcceptInvitationResponse = zInfer<typeof acceptInvitationResponseSchema>;
