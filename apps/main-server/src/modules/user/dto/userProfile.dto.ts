import { z } from 'zod';
import { registry } from '../../../config/openapiRegistry';
import { Gender } from '../../common/enums/gender.enum';
import { Honorific } from '../../common/enums/honorific.enum';

export const userProfileSchema = z.object({
  userName: z.string().openapi({ example: 'frankjia' }),
  email: z.string().email().optional().openapi({ example: 'test@example.com' }),
  lastName: z.string().openapi({ example: 'Jia' }),
  firstName: z.string().openapi({ example: 'Frank' }),
  middleName: z.string().optional().openapi({ example: 'M' }),
  gender: z.nativeEnum(Gender).openapi({ example: Gender.MALE }),
  dateOfBirth: z.string().openapi({ example: '1990-01-01T00:00:00.000Z' }),
  honorific: z.nativeEnum(Honorific).openapi({ example: Honorific.MR }),
  oauthProvider: z.string().optional().openapi({ example: 'google' }),
  avatarImage: z.string().url().openapi({ example: 'https://cdn.example.com/avatar.jpg' }),
});

// 🔸 标准 API 响应结构（用于 Swagger 注册和 controller 返回）
export const userProfileResponseSchema = registry.register(
  'UserProfileResponse',
  z.object({
    status: z.literal('success').openapi({ example: 'success' }),
    data: userProfileSchema,
  })
);

// 🔸 类型导出
export type UserProfilePayload = z.infer<typeof userProfileSchema>;
export type UserProfileResponse = z.infer<typeof userProfileResponseSchema>;
