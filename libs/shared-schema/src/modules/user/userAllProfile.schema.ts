import { Gender } from 'src/enums/gender.enum';
import { Honorific } from 'src/enums/honorific.enum';
import { z } from 'zod';

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

  /** 用户状态 */
  isActive: z.boolean(),

  /** 审计时间字段（来自 BaseEntity） */
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * 单个用户项响应（用于详情 / 列表项）
 */
export const userAllProfileResponseSchema = z.object({
  status: z.literal('success'),
  data: userAllProfileSchema,
});
export type UserAllProfilePayload = z.infer<typeof userAllProfileSchema>;
export type UserAllProfileResponse = z.infer<typeof userAllProfileResponseSchema>;
