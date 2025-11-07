import { serviceSummarySchema } from '../../../modules/service/response/summary.response.schema';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';
import { baseResourceSchema } from '../entity/resource.schema';

export const resourceDetailSchema = baseResourceSchema.extend({
  service: serviceSummarySchema,
});

export const resourceDetailResponseSchema = createSuccessResponseSchema(resourceDetailSchema);

export type ResourceDetail = zInfer<typeof resourceDetailSchema>;
export type ResourceDetailResponse = zInfer<typeof resourceDetailResponseSchema>;
