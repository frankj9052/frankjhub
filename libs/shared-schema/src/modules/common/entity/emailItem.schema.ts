import { emailTypeSchema } from '../../../enums';
import { z, zInfer } from '../../../libs/z';

export const emailItemSchema = z.object({
  type: emailTypeSchema,
  email: z.string(),
  is_public: z.boolean().optional(),
});

export type EmailItem = zInfer<typeof emailItemSchema>;
