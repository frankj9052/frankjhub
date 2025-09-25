import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';
import { invitationStatusSchema } from '../constants';
import { RoleSource } from '../../../enums/roleSource.enum';

export const invitationSchema = z.object({
  ...baseEntitySchema.shape,

  id: z.string().uuid(),

  // 外键
  organizationId: z.string().uuid(),
  organizationName: z.string(),
  orgTypeId: z.string().uuid(),
  orgTypeName: z.string(),

  targetRoleId: z.string().uuid(),
  targetRoleCode: z.string(),
  targetRoleName: z.string(),
  targetRoleSource: z.nativeEnum(RoleSource),

  // 邀请接收方
  email: z.string().email().max(320),

  // 邀请状态,
  status: invitationStatusSchema,

  // 邀请人
  inviterUserId: z.string().uuid().nullable(),
  inviterUserName: z.string().nullable(),

  // 接收者
  acceptedUserId: z.string().uuid().nullable(),
  acceptedUserName: z.string().nullable(),

  // 过期时间
  expiresAt: z.string(),

  // 安全令牌
  tokenHash: z.string().max(255),

  // 接收邀请的链接
  acceptUrlBase: z.string().max(512),

  // 附加信息
  meta: z.record(z.unknown()).nullable().optional(),
});

// 轻量引用：用于列表/查询场景
export const invitationRefSchema = invitationSchema.pick({
  id: true,
  organizationId: true,
  targetRoleId: true,
  email: true,
  status: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
});

// 类型导出
export type InvitationDto = zInfer<typeof invitationSchema>;
export type InvitationRef = zInfer<typeof invitationRefSchema>;
