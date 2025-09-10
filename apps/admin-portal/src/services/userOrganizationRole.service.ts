import { get, patch } from '@/libs/axios/client';
import { ValidationError } from '@frankjhub/shared-errors';
import {
  ApiResponse,
  idParamsSchema,
  UserOrganizationRoleSingleResponse,
  UserOrganizationRoleUpdateRequest,
  userOrganizationRoleUpdateRequestSchema,
} from '@frankjhub/shared-schema';
import { convertZodIssuesToErrorDetails } from '@frankjhub/shared-utils';

export async function getUserOrganizationRoleByUserId(
  id: string
): Promise<ApiResponse<UserOrganizationRoleSingleResponse>> {
  const parsedInput = idParamsSchema.safeParse({ id });
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error)).toJSON();
    return error;
  }
  const response = await get<UserOrganizationRoleSingleResponse>(
    `/api/user-organization-role/${parsedInput.data.id}`
  );

  return response;
}

export async function updateUserOrganizationRoleByUserId(
  data: UserOrganizationRoleUpdateRequest
): Promise<ApiResponse<UserOrganizationRoleSingleResponse>> {
  const parsedInput = userOrganizationRoleUpdateRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    const error = new ValidationError(convertZodIssuesToErrorDetails(parsedInput.error));
    return error.toJSON();
  }
  const response = await patch<UserOrganizationRoleSingleResponse>(
    '/api/user-organization-role/update',
    parsedInput.data
  );
  return response;
}
