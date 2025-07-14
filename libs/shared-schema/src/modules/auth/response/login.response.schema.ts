import { createSuccessResponseSchema } from '../../../factories';
import { userPayloadSchema } from '../userPayload.schema';
import { zInfer } from '../../../libs/z';

export const loginResponseSchema = createSuccessResponseSchema(userPayloadSchema);

export type LoginResponse = zInfer<typeof loginResponseSchema>;
