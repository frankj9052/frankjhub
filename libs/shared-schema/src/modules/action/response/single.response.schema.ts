import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { actionSchema } from '../entity';

export const actionSingleResponseSchema = createSuccessResponseSchema(actionSchema);

export type ActionSingleResponse = zInfer<typeof actionSingleResponseSchema>;
