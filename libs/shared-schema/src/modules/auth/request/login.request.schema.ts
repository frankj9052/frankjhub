import { z, zInfer } from '../../../libs/z';

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = zInfer<typeof loginRequestSchema>;
