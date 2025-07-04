import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { actionSchema } from '../entity/schema';

export const actionUpdateResponseSchema = createSuccessResponseSchema(actionSchema);
export type ActionUpdateResponse = zInfer<typeof actionUpdateResponseSchema>;
