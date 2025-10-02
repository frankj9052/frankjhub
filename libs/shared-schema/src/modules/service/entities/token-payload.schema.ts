import { z, zInfer } from '../../../libs/z';
import { serviceSchema } from './service.schema';

export const serviceJwtPayloadSchema = z
  .object({
    serviceId: serviceSchema.shape.serviceId,
    scopes: z.array(z.string()).default([]),
    // Issuer: 谁签发了这个 JWT, 一般认证服务器、服务网关或某个服务 ID
    iss: z.string().optional(),
    // Subject: JWT 的“主体”，通常是用户 ID 或服务 ID: booking
    sub: z.string().optional(),
    // Audience: JWT 的接收方，也就是 token 预期要发给谁用。
    aud: z.union([z.string(), z.array(z.string())]).optional(),
    // Expiration Time: 过期时间, 秒级的 Unix 时间戳
    exp: z.number().optional(),
    // Not Before: 生效时间, 在这个时间点之前，token 不能使用
    nbf: z.number().optional(),
    // Issued At: 签发时间, Unix 时间戳, 用来标记 token 生成的时间点
    iat: z.number().optional(),
    // JWT ID: JWT 的唯一标识符, 用来防止重放攻击，可以存到数据库里做“已用 token 黑名单”
    jti: z.string().optional(),
  })
  .catchall(z.unknown());

export type ServiceJwtPayload = zInfer<typeof serviceJwtPayloadSchema>;
