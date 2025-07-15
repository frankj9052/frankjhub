import { z, zInfer } from '../../libs/z';

export const zodIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
  // 可选扩展字段
  expected: z.any().optional(),
  received: z.any().optional(),
  minimum: z.number().optional(),
  type: z.string().optional(),
  inclusive: z.boolean().optional(),
});

export type ZodIssue = zInfer<typeof zodIssueSchema>;
