import { phoneTypeSchema } from '../../../enums';
import { z, zInfer } from '../../../libs/z';

export const phoneItemSchema = z.object({
  type: phoneTypeSchema,
  number: z.string(),
  ext: z.string().optional(),
  contry_code: z.string().optional(),
  is_public: z.boolean().optional(),
});

export type PhoneItem = zInfer<typeof phoneItemSchema>;
