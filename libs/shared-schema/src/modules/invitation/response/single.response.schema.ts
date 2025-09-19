import { createSuccessResponseSchema } from '../../../factories';
import { invitationSchema } from '../entity';
import { zInfer } from '../../../libs/z';

export const invitationSingleResponseSchema = createSuccessResponseSchema(invitationSchema);

export type InvitationSingleResponse = zInfer<typeof invitationSingleResponseSchema>;
