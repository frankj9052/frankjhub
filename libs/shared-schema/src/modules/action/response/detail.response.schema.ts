import { zInfer } from '../../../libs/z';
import { baseActionSchema } from '../entity/action.schema';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';

export const actionDetailSchema = baseActionSchema;
export const actionDetailResponse = createSuccessResponseSchema(actionDetailSchema);

export type ActionDetail = zInfer<typeof actionDetailSchema>;
export type ActionDetailResponse = zInfer<typeof actionDetailResponse>;
