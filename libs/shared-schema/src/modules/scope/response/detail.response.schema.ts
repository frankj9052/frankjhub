import { resourceSummarySchema } from '../../../modules/resource';
import { scopeSchema } from '../entity';
import { actionSummarySchema } from '../../../modules/action';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';

export const scopeDetailSchema = scopeSchema.extend({
  resource: resourceSummarySchema,
  action: actionSummarySchema,
});

export const scopeDetailResponseSchema = createSuccessResponseSchema(scopeDetailSchema);

export type ScopeDetail = zInfer<typeof scopeDetailSchema>;
export type ScopeDetailResponse = zInfer<typeof scopeDetailResponseSchema>;
