import { baseJwtPayloadSchema } from '../../../modules/common/entity/baseJwtPayload.schema';
import { z, zInfer } from '../../../libs/z';

export const serviceJwtPayloadSchema = baseJwtPayloadSchema
  .extend({
    type: z.literal('service'),
  })
  .catchall(z.unknown());

export const userJwtPayloadSchema = baseJwtPayloadSchema
  .extend({
    type: z.literal('user'),
    roleCodes: z.array(z.string()).default([]).optional(),
    userName: z.string(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    profileCompleted: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sessionVersion: z.number().optional(),
  })
  .catchall(z.unknown());

export const jwtPayloadSchema = z.union([serviceJwtPayloadSchema, userJwtPayloadSchema]);

export type ServiceJwtPayload = zInfer<typeof serviceJwtPayloadSchema>;
export type UserJwtPayload = zInfer<typeof userJwtPayloadSchema>;
export type JwtPayload = zInfer<typeof jwtPayloadSchema>;
