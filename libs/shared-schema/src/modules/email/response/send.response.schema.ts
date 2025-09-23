import { createSuccessResponseSchema } from 'src/factories';
import { emailOutboxSchema } from '../entity';
import { zInfer } from 'src/libs/z';

export const sendEmailResultSchema = emailOutboxSchema.pick({
  providerMessageId: true,
});

export const sendEmailResponseSchema = createSuccessResponseSchema(sendEmailResultSchema);

export type SendEmailResult = zInfer<typeof sendEmailResultSchema>;
export type SendEmailResponse = zInfer<typeof sendEmailResponseSchema>;
