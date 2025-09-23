import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';
import { EMAIL_RECEIPT_EVENT } from '../constants/receiptEvent.enum';

export const emailReceiptSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  providerMessageId: z.string().max(256),
  event: z.nativeEnum(EMAIL_RECEIPT_EVENT),
  payload: z.record(z.any()).optional(),
});

export type EmailReceiptDto = zInfer<typeof emailReceiptSchema>;
