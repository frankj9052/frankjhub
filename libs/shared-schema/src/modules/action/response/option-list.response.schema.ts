import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs/z';
import { actionOptionsSchema } from '../entity/schema';

export const actionOptionListResponseSchema = createSuccessResponseSchema(actionOptionsSchema);

export type ActionOptionListResponse = zInfer<typeof actionOptionListResponseSchema>;
