import { userRegisterRequestSchema } from '../../../modules/user';
import { z, zInfer } from '../../../libs/z';

export const acceptInvitationRequestSchema = z
  .object({
    ...userRegisterRequestSchema.shape,
    token: z.string(),
    rePassword: z.string(),
  })
  .refine(
    data => {
      return data.password === data.rePassword;
    },
    {
      message: "Passwords don't match!",
      path: ['rePassword'],
    }
  );

export type AcceptInvitationRequest = zInfer<typeof acceptInvitationRequestSchema>;
