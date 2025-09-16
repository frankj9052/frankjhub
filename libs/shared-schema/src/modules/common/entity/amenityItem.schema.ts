import { zInfer, z } from '../../../libs/z';

export const amenityItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.union([z.boolean(), z.string()]).optional(),
});

export type AmenityItem = zInfer<typeof amenityItemSchema>;
