import { z, zInfer } from '../../../libs/z';
import { baseEntitySchema } from '../../../modules/common';
import { EMAIL_SUPPRESSION_REASON } from '../constants';

export const emailSuppressionSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  email: z.string().max(320),
  reason: z.nativeEnum(EMAIL_SUPPRESSION_REASON),
});

export type EmailSuppressionDto = zInfer<typeof emailSuppressionSchema>;
