import { z } from '../../libs/z';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
