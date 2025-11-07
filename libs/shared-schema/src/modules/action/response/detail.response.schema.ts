import { zInfer } from 'src/libs';
import { baseActionSchema } from '../entity';
import { createSuccessResponseSchema } from '../../../factories';

export const actionDetailSchema = baseActionSchema;
export const actionDetailResponse = createSuccessResponseSchema(actionDetailSchema);

export type ActionDetail = zInfer<typeof actionDetailSchema>;
export type ActionDetailResponse = zInfer<typeof actionDetailResponse>;
