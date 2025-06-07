// 生成和提供 JWKS JSON 格式的公钥
import fs from 'fs';
import path from 'path';
import { env } from '../../../config/env';
import { getJose } from '../libs/lazyJose';

let cachedJwks: any | null = null;

export async function getJWKS(): Promise<{ keys: any[] }> {
  if (cachedJwks) return cachedJwks;

  const publicKeyPath = path.resolve(env.JWT_SERVICE_PUBLIC_KEY_PATH);
  const pem = fs.readFileSync(publicKeyPath, 'utf8');
  const { exportJWK, importSPKI } = await getJose();

  const key = await importSPKI(pem, 'RS256');
  const jwk = await exportJWK(key);

  const jwks = {
    keys: [
      {
        ...jwk,
        use: 'sig',
        kid: 'main-key',
        alg: 'RS256',
      },
    ],
  };

  cachedJwks = jwks;
  return jwks;
}
