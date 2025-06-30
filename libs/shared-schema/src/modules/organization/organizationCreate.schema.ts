import { zInfer } from '../../libs/z';
import { organizationSchema } from './organization.schema';

export const organizationCreateSchema = organizationSchema.pick({
  name: true,
  description: true,
  orgTypeId: true,
});

export type OrganizationCreateSchema = zInfer<typeof organizationCreateSchema>;
