import { z, zInfer } from '../../../libs/z';

export const acceptInvitationRequestSchema = z.object({
  token: z.string(),
  currentUserId: z.string().uuid(),
  currentUserEmail: z.string().email(),
});

export type AcceptInvitationRequest = zInfer<typeof acceptInvitationRequestSchema>;
