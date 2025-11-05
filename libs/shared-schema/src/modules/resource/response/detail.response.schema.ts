import { serviceSummarySchema } from '../../../modules/service';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';
import { baseResourceSchema } from '../entity';

export const resourceDetailSchema = baseResourceSchema.extend({
  service: serviceSummarySchema,
});

export const resourceDetailResponseSchema = createSuccessResponseSchema(resourceDetailSchema);

export type ResourceDetail = zInfer<typeof resourceDetailSchema>;
export type ResourceDetailResponse = zInfer<typeof resourceDetailResponseSchema>;
