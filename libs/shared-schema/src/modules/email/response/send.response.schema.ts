import { createSuccessResponseSchema } from '../../../factories';
import { emailOutboxSchema } from '../entity';
import { zInfer } from '../../../libs/z';

export const sendEmailResultSchema = emailOutboxSchema.pick({
  providerMessageId: true,
});

export const sendEmailResponseSchema = createSuccessResponseSchema(sendEmailResultSchema);

export type SendEmailResult = zInfer<typeof sendEmailResultSchema>;
export type SendEmailResponse = zInfer<typeof sendEmailResponseSchema>;
