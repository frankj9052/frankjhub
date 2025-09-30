import { z, zInfer } from '../../../libs/z';
import { userSchema } from '../entity';

export const userRegisterRequestSchema = userSchema
  .pick({
    userName: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    email: z.string().email(),
    password: z.string(),
    middleName: z.string().nullable().optional(),
  });

export type UserRegisterRequest = zInfer<typeof userRegisterRequestSchema>;
