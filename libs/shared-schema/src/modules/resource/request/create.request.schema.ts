import { zInfer } from '../../../libs/z';
import { baseResourceSchema } from '../entity';
import { withResourceFieldsConsistency } from '../entity/validation/resource.validation';

export const baseResourceCreateRequestSchema = baseResourceSchema
  .pick({
    qualifier: true,
    fieldsMode: true,
    fields: true,
    isActive: true,
    metadata: true,
  })
  .partial()
  .extend(
    baseResourceSchema
      .pick({
        namespace: true,
        entity: true,
      })
      .required().shape
  )
  .strict();

export const resourceCreateRequestSchema = withResourceFieldsConsistency(
  baseResourceCreateRequestSchema
);

export type ResourceCreateRequest = zInfer<typeof resourceCreateRequestSchema>;
