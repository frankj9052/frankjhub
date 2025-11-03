import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs';
import { baseResourceSchema } from '../entity';

export const resourceSummarySchema = baseResourceSchema.pick({
  id: true,
  resource_key: true,
  namespace: true,
  entity: true,
  qualifier: true,
  fieldsMode: true,
  fields: true,
  isActive: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const resourceSummaryResponseSchema = createSuccessResponseSchema(resourceSummarySchema);

export type ResourceSummary = zInfer<typeof resourceSummarySchema>;
export type ResourceSummaryResponse = zInfer<typeof resourceSummaryResponseSchema>;
