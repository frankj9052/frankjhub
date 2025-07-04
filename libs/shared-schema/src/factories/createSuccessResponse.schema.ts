import { z } from '../libs/z';
import { ZodLiteral, ZodObject, ZodOptional, ZodString, ZodTypeAny, ZodUnknown } from 'zod';

export function createSuccessResponseSchema(): ZodObject<{
  status: ZodLiteral<'success'>;
  message: ZodOptional<ZodString>;
  data: ZodOptional<ZodUnknown>;
}>;

export function createSuccessResponseSchema<T extends ZodTypeAny>(
  dataSchema: T
): ZodObject<{
  status: ZodLiteral<'success'>;
  message: ZodOptional<ZodString>;
  data: T;
}>;

export function createSuccessResponseSchema<T extends ZodTypeAny = ZodUnknown>(dataSchema?: T) {
  return z.object({
    status: z.literal('success'),
    message: z.string().optional(),
    data: (dataSchema ?? z.unknown()).optional(),
  });
}

export type SuccessResponse<T = unknown> = {
  status: 'success';
  message?: string;
  data?: T;
};
