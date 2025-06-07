import { z } from 'zod';
import { env } from '../../../config/env';
import { BadRequestError } from '../../common/errors/BadRequestError';
import { getJose } from '../libs/lazyJose';

let JWKS: ReturnType<any> | null = null;

const getRemoteJWKSet = async () => {
  if (JWKS) return JWKS;
  const { createRemoteJWKSet } = await getJose();
  JWKS = createRemoteJWKSet(new URL(env.SERVICE_AUTH_JWKS_URL));
  return JWKS;
};

const ServiceJwtPayloadSchema = z.object({
  serviceId: z.string(),
  scopes: z.array(z.string()),
  iss: z.string(),
  aud: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type ServiceJwtPayload = z.infer<typeof ServiceJwtPayloadSchema>;

export async function verifyServiceJwt(
  token: string,
  expectedAudience: string
): Promise<ServiceJwtPayload> {
  const { jwtVerify } = await getJose();
  const jwks = await getRemoteJWKSet();

  const { payload } = await jwtVerify(token, jwks, {
    algorithms: ['RS256'],
    issuer: env.SERVICE_AUTH_ISSUER,
    audience: expectedAudience,
  });

  const result = ServiceJwtPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new BadRequestError('Invalid JWT payload structure', result.error.format());
  }

  return payload as ServiceJwtPayload;
}
