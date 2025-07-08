import { z, zInfer } from '../../../libs/z';
import { organizationSchema } from '../entity/schema';

export const organizationUpdateRequestSchema = z
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

export type OrganizationUpdateRequest = zInfer<typeof organizationUpdateRequestSchema>;
