import { z, zInfer } from '../../../libs/z';
import { zodIssueSchema } from '../zodIssueSchema.schema';

export const errorDetailsSchema = z.union([
  z.array(zodIssueSchema), // Zod 验证错误
  z.string(), // 错误说明
  z.record(z.any()), // 任意调试信息
]);

export type ErrorDetails = zInfer<typeof errorDetailsSchema>;
