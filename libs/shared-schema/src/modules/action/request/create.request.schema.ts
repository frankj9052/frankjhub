import { zInfer } from '../../../libs/z';
import { actionSchema } from '../entity';

export const actionCreateRequestSchema = actionSchema.pick({
  name: true,
  description: true,
});

export type ActionCreateRequest = zInfer<typeof actionCreateRequestSchema>;
