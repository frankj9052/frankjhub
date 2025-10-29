import { zInfer } from '../../../libs/z';
import { withActionFieldsConsistency } from '../entity/validation/action.validation';
import { baseActionSchema } from '../entity';

export const baseActionCreateRequestSchema = baseActionSchema
  .pick({
    description: true,
    aliases: true,
    sortOrder: true,
    isActive: true,
  })
  .partial()
  .extend(
    baseActionSchema
      .pick({
        name: true,
        displayName: true,
      })
      .required().shape
  )
  .strict();

export const actionCreateRequestSchema = withActionFieldsConsistency(baseActionCreateRequestSchema);

export type ActionCreateRequest = zInfer<typeof actionCreateRequestSchema>;
