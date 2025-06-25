import { Gender } from '../../enums/gender.enum';
import { Honorific } from '../../enums/honorific.enum';
import { z, zInfer } from '../../libs/z';

/**
 * 用户展示用字段 schema（分页项 / 用户详情 / 非敏感输出）
 */
export const userAllProfileSchema = z.object({
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

/**
 * 单个用户项响应（用于详情 / 列表项）
 */
export const userAllProfileResponseSchema = z.object({
  status: z.literal('success'),
  data: userAllProfileSchema,
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export const userEditSchema = userAllProfileSchema
  .pick({
    userName: true,
    email: true,
    firstName: true,
    lastName: true,
    middleName: true,
    gender: true,
    dateOfBirth: true,
    honorific: true,
    avatarImage: true,
    isActive: true,
    emailVerified: true,
    profileCompleted: true,
  })
  .extend({
    password: z.string().optional(),
  });

export type UserEditSchema = zInfer<typeof userEditSchema>;
export type UserAllProfilePayload = zInfer<typeof userAllProfileSchema>;
export type UserAllProfileResponse = zInfer<typeof userAllProfileResponseSchema>;
