import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { organizationSchema } from '../entity/schema';

export const organizationOptionSchema = organizationSchema.pick({
  id: true,
  name: true,
  orgTypeId: true,
  orgTypeName: true,
  description: true,
});

export const organizationOptionListSchema = z.array(organizationOptionSchema);

export const organizationOptionListResponseSchema = createSuccessResponseSchema(
  organizationOptionListSchema
);

export type OrganizationOption = zInfer<typeof organizationOptionSchema>;
export type OrganizationOptionList = zInfer<typeof organizationOptionListSchema>;
export type OrganizationOptionListResponse = zInfer<typeof organizationOptionListResponseSchema>;
