import { get, post } from '@/libs/axios/client';
import {
  ApiResponse,
  BaseResponse,
  GetCurrentUserResponse,
  LoginRequest,
  loginRequestSchema,
  LoginResponse,
} from '@frankjhub/shared-schema';

export async function loginClient(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const parsedInput = loginRequestSchema.safeParse(data);
  if (!parsedInput.success) {
    return {
      status: 400,
      code: 'VALIDATION_ERROR',
      message: 'Invalid login request',
      details: parsedInput.error.issues,
      timestamp: new Date().toISOString(),
    };
  }
  const response = await post<LoginResponse>(`/api/auth/login`, parsedInput.data);
  if (response.status === 'success') {
    const hasPermission = response.data.orgRoles.some(orgRole => orgRole.orgType === 'platform');
    if (!hasPermission) {
      return {
        status: 403,
        code: 'NO_PLATFORM_PERMISSION',
        message: 'Email or password is incorrect',
        timestamp: new Date().toISOString(),
      };
    }
  }
  return response;
}

export async function getSessionClient(): Promise<ApiResponse<GetCurrentUserResponse>> {
  const response = await get<GetCurrentUserResponse>(`/api/auth/current-user`);
  return response;
}

export async function logoutClient(): Promise<ApiResponse<BaseResponse>> {
  const response = await post<BaseResponse>(`/api/auth/logout`);
  return response;
}
