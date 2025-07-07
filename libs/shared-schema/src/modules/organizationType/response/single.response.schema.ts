import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { organizationTypeSchema } from '../entity';

export const organizationTypeSingleResponseSchema =
  createSuccessResponseSchema(organizationTypeSchema);

export type organizationTypeSingleResponse = zInfer<typeof organizationTypeSingleResponseSchema>;
