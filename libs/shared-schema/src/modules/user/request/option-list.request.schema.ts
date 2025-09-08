import { z, zInfer } from '../../../libs/z';

export const userOptionListRequestSchema = z.object({
  keyword: z.string().optional(),
});

export type UserOptionListRequest = zInfer<typeof userOptionListRequestSchema>;
