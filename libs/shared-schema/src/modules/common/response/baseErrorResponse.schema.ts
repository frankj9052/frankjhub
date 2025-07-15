import { z, zInfer } from '../../../libs/z';
import { errorDetailsSchema } from './errorDetails.schema';

export const baseErrorResponseSchema = z.object({
  timestamp: z.string().datetime(), // ISO8601 时间戳
  status: z.number().int().gte(100).lte(599), // 合法 HTTP 状态码范围
  code: z.string(), // 业务错误码
  message: z.string(), // 错误信息
  requestId: z.string().optional(), // 链路追踪 ID（可选）
  details: errorDetailsSchema.optional(), // 调试附加信息（可能是 zod 报错等结构）
  cause: z.string().optional(), // 已序列化的 cause 信息
});

export type BaseErrorResponse = zInfer<typeof baseErrorResponseSchema>;
