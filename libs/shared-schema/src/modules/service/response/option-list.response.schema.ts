import { z, zInfer } from '../../../libs';
import { serviceRefSchema } from './ref.response.schema';
import { createSuccessResponseSchema } from '../../../factories';

export const serviceOptionSchema = serviceRefSchema;
export const serviceOptionListSchema = z.array(serviceOptionSchema);
export const serviceOptionListResponseSchema = createSuccessResponseSchema(serviceOptionListSchema);

export type ServiceOption = zInfer<typeof serviceOptionSchema>;
export type ServiceOptionList = zInfer<typeof serviceOptionListSchema>;
export type ServiceOptionListResponse = zInfer<typeof serviceOptionListResponseSchema>;
