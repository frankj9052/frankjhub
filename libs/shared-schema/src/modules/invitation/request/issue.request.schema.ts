import { invitationSchema } from '../entity';
import { z, zInfer } from '../../../libs/z';

export const issueInvitationRequestSchema = invitationSchema
  .pick({
    organizationId: true,
    targetRoleId: true,
    email: true,
    inviterUserId: true,
    acceptUrlBase: true,
    meta: true,
  })
  .extend({
    ttlHours: z.number().default(72).optional(),
  });

export type IssueInvitationRequest = zInfer<typeof issueInvitationRequestSchema>;
