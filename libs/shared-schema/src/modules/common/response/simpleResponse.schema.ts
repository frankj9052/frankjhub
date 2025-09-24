import { z, zInfer } from '../../../libs/z';

export const simpleResponseSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
});

export type SimpleResponse = zInfer<typeof simpleResponseSchema>;
