import { EnvJwt, ServiceJwtPayload, serviceJwtPayloadSchema } from '@frankjhub/shared-schema';
import { getJose } from '@frankjhub/shared-jose';
import { BadRequestError } from '@frankjhub/shared-errors';

let JWKS: ReturnType<any> | null = null;

const getRemoteJWKSet = async <T extends EnvJwt>(env: T) => {
  if (JWKS) return JWKS;
  const { createRemoteJWKSet } = await getJose();
  JWKS = createRemoteJWKSet(new URL(env.JWKS_URI));
  return JWKS;
};

export async function verifyServiceJwt<T extends EnvJwt>(
  token: string,
  expectedAudience: string,
  env: T
): Promise<ServiceJwtPayload> {
  const { jwtVerify } = await getJose();
  const jwks = await getRemoteJWKSet(env);

  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ['RS256'],
    issuer: env.JWT_ISSUER,
    audience: expectedAudience,
  });

  const result = serviceJwtPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid JWT payload structure', result.error.format());
  }

  return payload;
}
