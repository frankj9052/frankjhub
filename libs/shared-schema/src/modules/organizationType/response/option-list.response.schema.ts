import { createSuccessResponseSchema } from '../../../factories';
import { z, zInfer } from '../../../libs/z';
import { organizationTypeSchema } from '../entity';

export const organizationTypeOptionSchema = organizationTypeSchema.pick({
  id: true,
  name: true,
});

export const organizationTypeOptionsSchema = z.array(organizationTypeOptionSchema);

export const organizationTypeOptionListResponseSchema = createSuccessResponseSchema(
  organizationTypeOptionsSchema
);

export type OrganizationTypeOption = zInfer<typeof organizationTypeOptionSchema>;
export type OrganizationTypeOptions = zInfer<typeof organizationTypeOptionsSchema>;
export type OrganizationTypeOptionListResponse = zInfer<
  typeof organizationTypeOptionListResponseSchema
>;
