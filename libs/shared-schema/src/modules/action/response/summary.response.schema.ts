import { baseActionSchema } from '../entity';
import { zInfer } from 'src/libs';
import { createSuccessResponseSchema } from 'src/factories';

export const actionSummarySchema = baseActionSchema.pick({
  id: true,
  name: true,
  displayName: true,
  isSystem: true,
  sortOrder: true,
  isActive: true,
  deletedAt: true,
});

export const actionSummaryResponseSchema = createSuccessResponseSchema(actionSummarySchema);

export type ActionSummary = zInfer<typeof actionSummarySchema>;
export type ActionSummaryResponse = zInfer<typeof actionSummaryResponseSchema>;
