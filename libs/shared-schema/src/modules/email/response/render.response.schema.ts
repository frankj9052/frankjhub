import { z, zInfer } from 'src/libs/z';

export const renderEmailTemplateResultSchema = z.object({
  htmlBody: z.string(),
  textBody: z.string().optional(),
  subject: z.string().max(512).optional(),
});

export type RenderEmailTemplateResult = zInfer<typeof renderEmailTemplateResultSchema>;
