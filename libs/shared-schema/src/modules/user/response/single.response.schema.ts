import { zInfer } from '../../../libs/z';
import { createSuccessResponseSchema } from '../../../factories';
import { userSchema } from '../entity';

export const userSingleResponseSchema = createSuccessResponseSchema(userSchema);
export type UserSingleResponse = zInfer<typeof userSingleResponseSchema>;
