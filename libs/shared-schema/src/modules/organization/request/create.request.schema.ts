import { zInfer } from '../../../libs/z';
import { organizationSchema } from '../entity/schema';

export const organizationCreateRequestSchema = organizationSchema.pick({
  name: true,
  description: true,
  orgTypeId: true,
});

export type OrganizationCreateRequest = zInfer<typeof organizationCreateRequestSchema>;
