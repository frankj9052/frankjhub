import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { organizationTypeSchema } from '../entity';

export const organizationTypeOptionSchema = organizationTypeSchema.pick({
  id: true,
  name: true,
});

export const organizationTypeOptionListSchema = z.array(organizationTypeOptionSchema);

export const organizationTypeOptionListResponseSchema = createSuccessResponseSchema(
  organizationTypeOptionListSchema
);

export type OrganizationTypeOption = zInfer<typeof organizationTypeOptionSchema>;
export type OrganizationTypeOptionList = zInfer<typeof organizationTypeOptionListSchema>;
export type OrganizationTypeOptionListResponse = zInfer<
  typeof organizationTypeOptionListResponseSchema
>;
