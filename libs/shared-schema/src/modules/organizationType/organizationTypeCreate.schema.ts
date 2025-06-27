import { zInfer } from '../../libs/z';
import { organizationTypeSchema } from './organizationType.schema';

export const organizationTypeCreateSchema = organizationTypeSchema.pick({
  name: true,
  description: true,
});

export type OrganizationTypeCreateSchema = zInfer<typeof organizationTypeCreateSchema>;
