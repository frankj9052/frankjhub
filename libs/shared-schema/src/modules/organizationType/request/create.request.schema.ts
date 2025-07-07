import { zInfer } from '../../../libs/z';
import { organizationTypeSchema } from '../entity';

export const organizationTypeCreateRequestSchema = organizationTypeSchema.pick({
  name: true,
  description: true,
});

export type OrganizationTypeCreateRequest = zInfer<typeof organizationTypeCreateRequestSchema>;
