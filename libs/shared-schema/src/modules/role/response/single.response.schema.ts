import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { roleSchema } from '../entity';

export const roleSingleResponseSchema = createSuccessResponseSchema(roleSchema);

export type RoleSingleResponse = zInfer<typeof roleSingleResponseSchema>;
