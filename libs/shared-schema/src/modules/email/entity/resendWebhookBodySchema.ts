import { z, zInfer } from '../../../libs/z';

// 公共 data 字段
const baseDataSchema = z.object({
  broadcast_id: z.string().optional(),
  created_at: z.string().datetime().optional(),
  email_id: z.string(),
  from: z.string(),
  to: z.array(z.string()),
  subject: z.string().optional(),
  tags: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

// bounce 对象
const bounceSchema = z.object({
  message: z.string(),
  subType: z.string(),
  type: z.string(),
});

// failed 对象
const failedSchema = z.object({
  reason: z.string(),
});

// click 对象
const clickSchema = z.object({
  ipAddress: z.string(),
  link: z.string(),
  timestamp: z.string().datetime(),
  userAgent: z.string(),
});

// data schema 包含可选事件字段
const dataSchema = baseDataSchema
  .extend({
    bounce: bounceSchema.optional(),
    failed: failedSchema.optional(),
    click: clickSchema.optional(),
  })
  .refine(data => data.bounce || data.failed || data.click || true, {
    message: 'At least one of bounce, failed, click, or none must exist',
  });

// 顶层 webhook schema
export const resendWebhookBodySchema = z.object({
  type: z.enum([
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.complained',
    'email.bounced',
    'email.opened',
    'email.clicked',
    'email.failed',
  ]),
  created_at: z.string().datetime(),
  data: dataSchema,
});

// TypeScript 类型
export type ResendWebhookBody = zInfer<typeof resendWebhookBodySchema>;
