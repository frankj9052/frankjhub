import { Gender } from '../../enums/gender.enum';
import { Honorific } from '../../enums/honorific.enum';
import { z, zInfer } from '../../libs/z';

export const userProfileSchema = z.object({
  userName: z.string(),
  email: z.string().email().optional(),
  lastName: z.string(),
  firstName: z.string(),
  middleName: z.string().optional(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string(),
  honorific: z.nativeEnum(Honorific),
  oauthProvider: z.string().optional(),
  avatarImage: z.string().url(),
});

// 🔸 标准 API 响应结构（用于 Swagger 注册和 controller 返回）
export const userProfileResponseSchema = z.object({
  status: z.literal('success'),
  data: userProfileSchema,
});

// 🔸 类型导出
export type UserProfilePayload = zInfer<typeof userProfileSchema>;
export type UserProfileResponse = zInfer<typeof userProfileResponseSchema>;
