import { z, zInfer } from '../../../libs/z';

export const organizationTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export const organizationTypeRefSchema = organizationTypeSchema.pick({
  id: true,
  name: true,
  description: true,
});

export type OrganizationTypeDto = zInfer<typeof organizationTypeSchema>;
export type OrganizationTypeRef = zInfer<typeof organizationTypeRefSchema>;
