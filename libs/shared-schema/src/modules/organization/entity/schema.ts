import { z, zInfer } from '../../../libs/z';

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  orgTypeId: z.string().uuid(),
  orgTypeName: z.string(),
  isActive: z.boolean().default(true).optional(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export const organizationRefSchema = organizationSchema.pick({
  id: true,
  name: true,
  description: true,
  orgTypeId: true,
  orgTypeName: true,
});

export type OrganizationDto = zInfer<typeof organizationSchema>;
export type OrganizationRef = zInfer<typeof organizationRefSchema>;
