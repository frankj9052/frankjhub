import { z, zInfer } from '../../../libs/z';
import { resourceSchema } from '../entity';

export const resourceUpdateRequestSchema = z.object({ id: resourceSchema.shape.id }).extend(
  resourceSchema
    .pick({
      name: true,
      description: true,
      isActive: true,
    })
    .partial().shape
);

export type ResourceUpdateRequest = zInfer<typeof resourceUpdateRequestSchema>;
