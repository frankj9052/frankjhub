import { zInfer } from '../../../libs';
import { baseResourceSummarySchema } from './summary.response.schema';
import { withFieldsConsistency } from '../entity/resource.validation';

export const resourceDetailSchema = withFieldsConsistency(
  baseResourceSummarySchema.extend({
    // service: serviceRefSchema
  })
);

export type ResourceDetail = zInfer<typeof resourceDetailSchema>;
