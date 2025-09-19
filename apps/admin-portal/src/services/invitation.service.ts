import { del, get, patch, post } from '@/libs/axios/client';
import { ValidationError } from '@frankjhub/shared-errors';
import {
  AcceptInvitationRequest,
  acceptInvitationRequestSchema,
  AcceptInvitationResponse,
  ApiResponse,
  idParamsSchema,
  InvitationListRequest,
  invitationListRequestSchema,
  InvitationListResponse,
  InvitationSingleResponse,
  IssueInvitationRequest,
  issueInvitationRequestSchema,
  IssueInvitationResponse,
} from '@frankjhub/shared-schema';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-utils';

export async function getInvitationList(
  data: InvitationListRequest
): Promise<ApiResponse<InvitationListResponse>> {
  const parsedInput = invitationListRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<InvitationListResponse>('/api/invitation/list', {
    params: parsedInput.data,
  });
  return response;
}

export async function issueInvitation(
  data: IssueInvitationRequest
): Promise<ApiResponse<IssueInvitationResponse>> {
  const parsedInput = issueInvitationRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await post<IssueInvitationResponse>('/api/invitation/issue', parsedInput.data);
  return response;
}

export async function acceptInvitation(
  data: AcceptInvitationRequest
): Promise<ApiResponse<AcceptInvitationResponse>> {
  const parsedInput = acceptInvitationRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await patch<AcceptInvitationResponse>(
    '/api/invitation/accept',
    parsedInput.data
  );
  return response;
}

export async function revokeInvitation(id: string): Promise<ApiResponse<InvitationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await patch<InvitationSingleResponse>(
    '/api/invitation/revoke',
    parsedInput.data
  );
  return response;
}

export async function hardDeleteInvitation(
  id: string
): Promise<ApiResponse<InvitationSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await del<InvitationSingleResponse>('/api/invitation/hard-delete', {
    params: parsedInput.data,
  });
  return response;
}
