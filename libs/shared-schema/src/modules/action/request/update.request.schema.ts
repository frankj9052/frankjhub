import { z, zInfer } from '../../../libs/z';
import { actionSchema } from '../entity';

export const actionUpdateRequestSchema = z
  .object({
    id: actionSchema.shape.id,
  })
  .extend(
    actionSchema
      .pick({
        name: true,
        displayName: true,
        description: true,
        isActive: true,
      })
      .partial().shape
  );

export type ActionUpdateRequest = zInfer<typeof actionUpdateRequestSchema>;
