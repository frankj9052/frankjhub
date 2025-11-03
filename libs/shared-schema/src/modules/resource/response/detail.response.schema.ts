import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';
import { baseResourceSchema } from '../entity';

export const resourceDetailSchema = baseResourceSchema;

export const resourceDetailResponseSchema = createSuccessResponseSchema(resourceDetailSchema);

export type ResourceDetail = zInfer<typeof resourceDetailSchema>;
export type ResourceDetailResponse = zInfer<typeof resourceDetailResponseSchema>;
