import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { organizationSchema } from '../entity/schema';

export const organizationSingleResponseSchema = createSuccessResponseSchema(organizationSchema);
export type OrganizationSingleResponse = zInfer<typeof organizationSingleResponseSchema>;
