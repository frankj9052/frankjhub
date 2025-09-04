import { zInfer, z } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';

export const contactSchema = z.object({
  ...baseEntitySchema.shape,
  name: z.string().trim().max(80).optional().or(z.literal('')),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid address.' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[\d+\-()\s]*$/, {
      message: 'Phone can include digits, spaces, () - +',
    })
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().min(3, { message: 'Subject must be at least 3 characters.' }).max(120),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters.' })
    .max(5000),
});

export type ContactDto = zInfer<typeof contactSchema>;
