import { z, zInfer } from '../../../libs/z';
import { Gender } from '../../../enums/gender.enum';
import { Honorific } from '../../../enums/honorific.enum';

export const userSchema = z.object({
  /** 主键 UUID */
  id: z.string().uuid(),

  /** 用户名（唯一） */
  userName: z.string(),

  /** 邮箱（可空） */
  email: z.string().nullable(),

  /** 姓名信息 */
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),

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

  /** 审计时间字段（来自 BaseEntity） */
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export type UserDto = zInfer<typeof userSchema>;
