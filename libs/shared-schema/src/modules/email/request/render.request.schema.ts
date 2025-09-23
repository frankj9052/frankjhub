import { z, zInfer } from 'src/libs/z';

export const renderEmailTemplateRequestSchema = z.object({
  templateKey: z.string().max(128),
  templateVars: z.record(z.any()),
});

export type RenderEmailTemplateRequest = zInfer<typeof renderEmailTemplateRequestSchema>;
