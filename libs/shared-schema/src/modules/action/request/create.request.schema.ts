import { z, zInfer } from '../../../libs/z';
import { actionSchema } from '../entity';

/**
 * 创建 Action 时允许传入的字段：
 * - name：必填，小写、规范化
 * - displayName：可选
 * - description：可选
 * - aliases：可选（string[] 或 null）
 * 其余字段如 isSystem / sortOrder / isActive 由系统自动处理
 */
export const actionCreateRequestSchema = actionSchema
  .pick({
    name: true,
    displayName: true,
    description: true,
    aliases: true,
  })
  .extend({
    // 创建时不允许传 isSystem、sortOrder、isActive 等字段
    isSystem: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  });

export type ActionCreateRequest = zInfer<typeof actionCreateRequestSchema>;
