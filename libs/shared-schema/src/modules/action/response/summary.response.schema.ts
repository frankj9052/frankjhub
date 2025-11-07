import { baseActionSchema } from '../entity';
import { zInfer } from '../../../libs';
import { createSuccessResponseSchema } from '../../../factories';

export const actionSummarySchema = baseActionSchema.pick({
  id: true,
  name: true,
  displayName: true,
  isSystem: true,
  sortOrder: true,
  isActive: true,
  deletedAt: true,
  updatedAt: true,
  createdAt: true,
});

export const actionSummaryResponseSchema = createSuccessResponseSchema(actionSummarySchema);

export type ActionSummary = zInfer<typeof actionSummarySchema>;
export type ActionSummaryResponse = zInfer<typeof actionSummaryResponseSchema>;
