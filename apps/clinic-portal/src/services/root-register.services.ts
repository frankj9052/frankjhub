import { AcceptInvitationRequest, acceptInvitationRequestSchema } from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function acceptInvitation(data: AcceptInvitationRequest) {
  const validationResult = validateInput(acceptInvitationRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await get('/');
}
