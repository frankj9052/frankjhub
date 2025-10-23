import { getJose } from '@frankjhub/shared-jose';
import {
  EnvJwt,
  JwtPayload,
  serviceJwtPayloadSchema,
  userJwtPayloadSchema,
} from '@frankjhub/shared-schema';
import { getRemoteJWKSet } from '../utils/getRemoteJWKSet';
import { BadRequestError } from '@frankjhub/shared-errors';

export async function verifyJwt<T extends EnvJwt>(
  token: string,
  expectedAudience: string,
  env: T
): Promise<JwtPayload> {
  const { jwtVerify } = await getJose();
  const jwks = await getRemoteJWKSet(env);

  const res = await jwtVerify(token, jwks, {
    algorithms: ['RS256'],
    issuer: env.JWT_ISSUER,
    audience: expectedAudience,
  });

  const payload = res.payload as JwtPayload;
  let result = null;
  if (payload.type === 'user') {
    result = userJwtPayloadSchema.safeParse(payload);
  } else {
    result = serviceJwtPayloadSchema.safeParse(payload);
  }

  if (!result.success) {
    throw new BadRequestError('Invalid JWT payload structure', result.error.format());
  }

  return result.data;
}
