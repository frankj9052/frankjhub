import { z, zInfer } from '../../../libs/z';

/** 速率限制对象 */
export const rateLimitSchema = z.object({
  windowMs: z.number().int().positive().describe('Time window in milliseconds'),
  max: z
    .number()
    .int()
    .nonnegative()
    .describe('Maximum number of requests allowed within the window'),
});

export type RateLimit = zInfer<typeof rateLimitSchema>;
