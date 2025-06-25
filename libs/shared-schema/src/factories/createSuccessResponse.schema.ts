import { z } from '../libs/z';
import { ZodTypeAny, ZodUnknown } from 'zod';

export function createSuccessResponseSchema<T extends ZodTypeAny = ZodUnknown>(dataSchema?: T) {
  return z.object({
    status: z.literal('success'),
    message: z.string().optional(),
    data: dataSchema ?? z.unknown().optional(),
  });
}

export type SuccessResponse<T = unknown> = {
  status: 'success';
  message?: string;
  data?: T;
};
