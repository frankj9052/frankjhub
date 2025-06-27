import { z } from '../../libs/z';

export const idParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});
