import { userPayloadSchema } from '../../../modules/auth';
import { createSuccessResponseSchema } from '../../../factories';
import { zInfer } from '../../../libs/z';

export const sessionResponseSchema = createSuccessResponseSchema(userPayloadSchema);
export type SessionResponse = zInfer<typeof sessionResponseSchema>;
