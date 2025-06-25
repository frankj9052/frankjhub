import { z, zInfer } from '../../libs/z';
import { userAllProfileSchema } from './userAllProfile.schema';

export const userProfileSchema = userAllProfileSchema.pick({
  userName: true,
  email: true,
  lastName: true,
  firstName: true,
  middleName: true,
  gender: true,
  dateOfBirth: true,
  honorific: true,
  oauthProvider: true,
  avatarImage: true,
});

// 🔸 标准 API 响应结构（用于 Swagger 注册和 controller 返回）
export const userProfileResponseSchema = z.object({
  status: z.literal('success'),
  data: userProfileSchema,
});

// 🔸 类型导出
export type UserProfilePayload = zInfer<typeof userProfileSchema>;
export type UserProfileResponse = zInfer<typeof userProfileResponseSchema>;
