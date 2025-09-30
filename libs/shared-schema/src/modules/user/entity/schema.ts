import { z, zInfer } from '../../../libs/z';
import { Gender } from '../../../enums/gender.enum';
import { Honorific } from '../../../enums/honorific.enum';
import { baseEntitySchema } from '../../../modules/common';

export const userSchema = z.object({
  ...baseEntitySchema.shape,
  /** 主键 UUID */
  id: z.string().uuid(),

  /** 用户名（唯一） */
  userName: z.string(),

  /** 邮箱（可空） */
  email: z.string().nullable(),

  /** 姓名信息 */
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable().default(null),

  /** 个人信息 */
  gender: z.nativeEnum(Gender).nullable(),
  dateOfBirth: z.string().nullable(),
  honorific: z.nativeEnum(Honorific).nullable(),
  avatarImage: z.string().nullable(),

  /** OAuth 相关（只暴露 provider） */
  oauthProvider: z.string().nullable(),
  oauthId: z.string().nullable(),

  /** 用户状态 */
  isActive: z.boolean(),
  emailVerified: z.boolean(),
  profileCompleted: z.boolean(),
  refreshToken: z.string().nullable(),
  sessionVersion: z.string(),
});

export const userRefSchema = userSchema.pick({
  id: true,
  userName: true,
  email: true,
  firstName: true,
  lastName: true,
  middleName: true,
  gender: true,
  dateOfBirth: true,
  honorific: true,
  avatarImage: true,
});

export type UserDto = zInfer<typeof userSchema>;
export type UserRef = zInfer<typeof userRefSchema>;
