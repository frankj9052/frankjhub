import { zInfer } from '../../../libs/z';
import { resourceSchema } from '../entity';

export const resourceCreateRequestSchema = resourceSchema.pick({
  name: true,
  description: true,
});

export type ResourceCreateRequest = zInfer<typeof resourceCreateRequestSchema>;
