import { z } from '../../../../libs/z';

export const rateLimitSchema = z
  .object({
    windowMs: z.number().int().positive().default(60_000).describe('Time window in ms'),
    max: z.number().int().positive().default(60).describe('Max requests per window'),
    standardHeaders: z.boolean().optional(),
    legacyHeaders: z.boolean().optional(),
    keyGenerator: z.string().optional().describe('Server-side identifier of key generator'),
  })
  .partial()
  .strict()
  .optional()
  .nullable();
