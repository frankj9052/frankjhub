import { z, zInfer } from '../../../libs/z';
import { userSchema } from '../entity';

export const userUpdateRequestSchema = userSchema
  .pick({
    userName: true,
    email: true,
    firstName: true,
    lastName: true,
    middleName: true,
    gender: true,
    dateOfBirth: true,
    honorific: true,
    avatarImage: true,
    isActive: true,
    emailVerified: true,
    profileCompleted: true,
  })
  .partial()
  .extend({
    id: userSchema.shape.id, // 👈 必填 ID
    password: z.string().optional(), // 👈 可选字段
  });

export type UserUpdateRequest = zInfer<typeof userUpdateRequestSchema>;
