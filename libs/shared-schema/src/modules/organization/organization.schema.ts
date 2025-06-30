import { z, zInfer } from '../../libs/z';

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  orgTypeId: z.string().uuid(),
  isActive: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  updatedAt: z.string(),
  updatedBy: z.string().nullable(),
  deletedAt: z.string().nullable(),
  deletedBy: z.string().nullable(),
});

export const organizationWithOrgTypeNameSchema = organizationSchema.extend({
  orgTypeName: z.string(),
});

export type OrganizationSchema = zInfer<typeof organizationSchema>;
export type OrganizationWithOrgTypeNameSchema = zInfer<typeof organizationWithOrgTypeNameSchema>;
