import { post } from '@/libs/axios/client';
import {
  AcceptInvitationRequest,
  acceptInvitationRequestSchema,
  AcceptInvitationResponse,
  ApiResponse,
} from '@frankjhub/shared-schema';
import { validateInput } from '@frankjhub/shared-utils';

export async function acceptInvitation(
  data: AcceptInvitationRequest
): Promise<ApiResponse<AcceptInvitationResponse>> {
  const validationResult = validateInput(acceptInvitationRequestSchema, data);
  if (!validationResult.success) {
    return validationResult.error;
  }
  const response = await post<AcceptInvitationResponse>(
    '/api/invitation/accept',
    validationResult.data
  );

  return response;
}
