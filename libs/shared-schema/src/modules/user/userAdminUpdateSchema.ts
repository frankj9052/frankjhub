import { userAllProfileSchema } from './userAllProfile.schema';
import { z, zInfer } from '../../libs/z';

export const userAdminUpdateSchema = z
  .object({
    id: userAllProfileSchema.shape.id, // 必填
  })
  .extend(
    userAllProfileSchema
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
      .partial().shape // 👈 其它字段都变 optional
  );

export type UserAdminUpdateSchema = zInfer<typeof userAdminUpdateSchema>;
