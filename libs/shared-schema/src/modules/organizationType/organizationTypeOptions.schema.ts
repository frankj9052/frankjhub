import { z, zInfer } from '../../libs/z';

export const orgTypeOptionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const orgTypeOptionsSchema = z.array(orgTypeOptionSchema);

export type OrgTypeOptionSchema = zInfer<typeof orgTypeOptionsSchema>;
export type OrgTypeOptionsSchema = zInfer<typeof orgTypeOptionsSchema>;
