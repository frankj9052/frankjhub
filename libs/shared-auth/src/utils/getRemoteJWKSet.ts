import { getJose } from '@frankjhub/shared-jose';
import { EnvJwt } from '@frankjhub/shared-schema';

let JWKS: ReturnType<any> | null = null;

export const getRemoteJWKSet = async <T extends EnvJwt>(env: T) => {
  if (JWKS) return JWKS;
  const { createRemoteJWKSet } = await getJose();
  JWKS = createRemoteJWKSet(new URL(env.JWKS_URI));
  return JWKS;
};
