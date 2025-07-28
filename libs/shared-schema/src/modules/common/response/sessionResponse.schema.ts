import { userPayloadSchema } from '../../../modules/auth/userPayload.schema';
import { createSuccessResponseSchema } from '../../../factories/createSuccessResponse.schema';
import { zInfer } from '../../../libs/z';

export const sessionResponseSchema = createSuccessResponseSchema(userPayloadSchema);
export type SessionResponse = zInfer<typeof sessionResponseSchema>;
