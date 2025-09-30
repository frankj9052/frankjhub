import { userRegisterRequestSchema } from '../../../modules/user';
import { z, zInfer } from '../../../libs/z';

export const acceptInvitationRequestSchema = z
  .object({
    ...userRegisterRequestSchema.shape,
    token: z.string(),
    rePassword: z.string(),
  })
  .superRefine((data, ctx) => {
    // 字段级 superRefine 可以拿到 ctx.parent
    const pwd = data.password;
    const rePwd = data.rePassword;
    // 两边都有值才比对，避免“都空也相等”的误伤
    if (pwd && rePwd && pwd.length > 0 && rePwd.length > 0 && rePwd !== pwd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match!",
        path: ['rePassword'],
      });
    }
  });

export type AcceptInvitationRequest = zInfer<typeof acceptInvitationRequestSchema>;
