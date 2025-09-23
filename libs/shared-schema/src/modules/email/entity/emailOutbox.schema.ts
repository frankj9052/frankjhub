import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';
import { EMAIL_CHANNEL, EMAIL_PROVIDER, EMAIL_STATUS } from '../constants';

export const emailOutboxSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  to: z.string().max(320),
  cc: z.string().max(320).optional(),
  bcc: z.string().max(320).optional(),
  from: z.string().max(320),
  replyTo: z.string().max(320).optional(),
  subject: z.string().max(512),
  templateKey: z.string().max(128).optional(),
  templateVars: z.record(z.any()).optional(),
  htmlBody: z.string().optional(),
  textBody: z.string().optional(),
  channel: z.nativeEnum(EMAIL_CHANNEL),
  status: z.nativeEnum(EMAIL_STATUS),
  providerMessageId: z.string().max(256).optional(),
  provider: z.nativeEnum(EMAIL_PROVIDER),
  idempotencyKey: z.string().max(128).optional(),
  attempt: z.number().int().nonnegative(),
  lastError: z.string().optional(),
  traceId: z.string().max(128).optional(),
});

export type EmailOutboxDto = zInfer<typeof emailOutboxSchema>;
