import { zInfer } from '../../../libs/z';
import { baseResourceSchema } from '../entity';
import { withResourceFieldsConsistency } from '../entity/validation/resource.validation';

export const baseResourceUpdateRequestSchema = baseResourceSchema
  .pick({
    fieldsMode: true,
    fields: true,
    isActive: true,
    metadata: true,
  })
  .partial()
  .strict();

export const resourceUpdateRequestSchema = withResourceFieldsConsistency(
  baseResourceUpdateRequestSchema
);

export type ResourceUpdateRequest = zInfer<typeof resourceUpdateRequestSchema>;
