import { zInfer } from '../../../libs';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { scopeSchema } from '../entity/scope.schema';

export const scopeSummarySchema = scopeSchema.pick({
  id: true,
  key: true,
  actionName: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
});

export const scopeSummaryResponseSchema = createSuccessResponseSchema(scopeSummarySchema);

export type ScopeSummary = zInfer<typeof scopeSummarySchema>;
export type ScopeSummaryResponse = zInfer<typeof scopeSummaryResponseSchema>;
