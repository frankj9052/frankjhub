import { baseJwtPayloadSchema } from '../../../modules/common/entity/baseJwtPayload.schema';
import { z, zInfer } from '../../../libs/z';
import { userPayloadSchema } from '../../../modules/auth';

export const serviceJwtPayloadSchema = baseJwtPayloadSchema
  .extend({
    type: z.literal('service'),
  })
  .catchall(z.unknown());

export const userJwtPayloadSchema = baseJwtPayloadSchema
  .extend({
    type: z.literal('user'),
    roleCodes: z.array(z.string()).default([]).optional(),
    userName: userPayloadSchema.shape.userName,
    email: userPayloadSchema.shape.userName,
    emailVerified: userPayloadSchema.shape.emailVerified,
    profileCompleted: userPayloadSchema.shape.profileCompleted,
    isActive: userPayloadSchema.shape.isActive,
    sessionVersion: userPayloadSchema.shape.sessionVersion,
    orgRoles: userPayloadSchema.shape.orgRoles,
  })
  .catchall(z.unknown());

export const jwtPayloadSchema = z.union([serviceJwtPayloadSchema, userJwtPayloadSchema]);

export type ServiceJwtPayload = zInfer<typeof serviceJwtPayloadSchema>;
export type UserJwtPayload = zInfer<typeof userJwtPayloadSchema>;
export type JwtPayload = zInfer<typeof jwtPayloadSchema>;
