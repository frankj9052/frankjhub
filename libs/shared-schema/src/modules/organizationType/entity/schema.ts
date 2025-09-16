import { baseEntitySchema } from '../../../modules/common';
import { z, zInfer } from '../../../libs/z';

export const organizationTypeSchema = z.object({
  ...baseEntitySchema.shape,
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
});

export const organizationTypeRefSchema = organizationTypeSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type OrganizationTypeDto = zInfer<typeof organizationTypeSchema>;
export type OrganizationTypeRef = zInfer<typeof organizationTypeRefSchema>;
