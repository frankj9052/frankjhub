import { z, zInfer } from '../../libs/z';
import { organizationTypeSchema } from './organizationType.schema';

export const organizationTypeUpdateSchema = z
  .object({
    id: organizationTypeSchema.shape.id,
  })
  .extend(
    organizationTypeSchema
      .pick({
        name: true,
        description: true,
        isActive: true,
      })
      .partial().shape
  );

export type OrganizationTypeUpdateSchema = zInfer<typeof organizationTypeUpdateSchema>;
