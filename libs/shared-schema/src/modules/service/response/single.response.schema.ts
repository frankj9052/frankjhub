import { createSuccessResponseSchema } from '../../../factories';
import { serviceSchema } from '../entities';
import { zInfer } from '../../../libs/z';

export const serviceSingleResponseSchema = createSuccessResponseSchema(serviceSchema);

export type ServiceSingleResponse = zInfer<typeof serviceSingleResponseSchema>;
