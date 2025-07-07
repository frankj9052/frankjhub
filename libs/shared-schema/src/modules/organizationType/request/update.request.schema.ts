import { z, zInfer } from '../../../libs/z';
import { organizationTypeSchema } from '../entity';

export const organizationTypeUpdateRequestSchema = z
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

export type OrganizationTypeUpdateRequest = zInfer<typeof organizationTypeUpdateRequestSchema>;
