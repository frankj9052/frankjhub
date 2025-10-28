import { zInfer } from '../../../libs/z';
import { withActionFieldsConsistency } from '../entity/validation/action.validation';
import { baseActionSchema } from '../entity';

export const baseActionUpdateRequestSchema = baseActionSchema
  .pick({
    name: true,
    displayName: true,
    description: true,
    aliases: true,
    sortOrder: true,
    isActive: true,
  })
  .partial()
  .extend(
    baseActionSchema
      .pick({
        id: true,
      })
      .required().shape
  )
  .strict();

export const actionUpdateRequestSchema = withActionFieldsConsistency(baseActionUpdateRequestSchema);

export type ActionUpdateRequest = zInfer<typeof actionUpdateRequestSchema>;
