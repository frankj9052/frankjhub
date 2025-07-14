import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';

export const baseResponseSchema = createSuccessResponseSchema();

export type BaseResponse = zInfer<typeof baseResponseSchema>;
