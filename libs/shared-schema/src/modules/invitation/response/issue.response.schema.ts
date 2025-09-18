import { zInfer, z } from '../../../libs/z';
import { invitationSchema } from '../entity';
import { createSuccessResponseSchema } from '../../../factories';

export const issueInvitationDataSchema = invitationSchema
  .pick({
    expiresAt: true,
  })
  .extend({
    invitationId: z.string().uuid(),
    token: z.string(),
  });

export const issueInvitationResponseSchema = createSuccessResponseSchema(issueInvitationDataSchema);

export type IssueInvitationData = zInfer<typeof issueInvitationDataSchema>;
export type IssueInvitationResponse = zInfer<typeof issueInvitationResponseSchema>;
