import { zInfer } from '../../../libs/z';
import { emailOutboxSchema } from '../entity';

export const sendEmailRequestSchema = emailOutboxSchema
  .pick({
    htmlBody: true,
    textBody: true,
    from: true,
    cc: true,
    bcc: true,
    replyTo: true,
    templateKey: true,
    templateVars: true,
    channel: true,
    idempotencyKey: true,
    traceId: true,
  })
  .partial()
  .extend({
    to: emailOutboxSchema.shape.to,
    subject: emailOutboxSchema.shape.subject,
  });

export type SendEmailRequest = zInfer<typeof sendEmailRequestSchema>;
