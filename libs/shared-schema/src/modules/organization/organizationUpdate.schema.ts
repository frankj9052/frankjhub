import { z, zInfer } from '../../libs/z';
import { organizationSchema } from './organization.schema';

export const organizationUpdateSchema = z
  .object({
    id: organizationSchema.shape.id,
  })
  .extend(
    organizationSchema
      .pick({
        name: true,
        description: true,
        orgTypeId: true,
        isActive: true,
      })
      .partial().shape
  );

export type OrganizationUpdateSchema = zInfer<typeof organizationUpdateSchema>;
