import { z, zInfer } from '../../../libs/z';
import { userSchema } from '../entity';

export const userRegisterRequestSchema = userSchema
  .pick({
    userName: true,
    firstName: true,
    lastName: true,
    middleName: true,
  })
  .extend({
    email: z.string().email(),
    password: z.string(),
  });

export type UserRegisterRequest = zInfer<typeof userRegisterRequestSchema>;
