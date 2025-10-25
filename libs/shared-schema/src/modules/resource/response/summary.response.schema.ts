import { z, zInfer } from '../../../libs';
import { fieldsModeSchema } from '../constants';
import { fieldNameSchema, resourceRefSchema } from '../entity';
import { withFieldsConsistency } from '../entity/resource.validation';

export const baseResourceSummarySchema = resourceRefSchema.extend({
  fieldsMode: fieldsModeSchema,
  fields: z.array(fieldNameSchema).default([]),
  metadata: z.record(z.unknown()).default({}),
  version: z.number().int().nonnegative(),
});

export const resourceSummarySchema = withFieldsConsistency(baseResourceSummarySchema);

export type ResourceSummary = zInfer<typeof resourceSummarySchema>;
