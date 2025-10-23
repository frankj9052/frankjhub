import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { createLoggerWithContext } from '../common/libs/logger';
import { getJose } from './libs/lazyJose';
import { JwtPayload, ServiceJwtPayload } from '@frankjhub/shared-schema';

const logger = createLoggerWithContext('ServiceTokenService');

let cachedPrivateKey: CryptoKey | null = null;
let cachedPublicKey: CryptoKey | null = null;

const getPrivateKey = async (): Promise<CryptoKey> => {
  if (cachedPrivateKey) return cachedPrivateKey;
  const privatePem = fs.readFileSync(path.resolve(env.JWT_SERVICE_PRIVATE_KEY_PATH), 'utf8');
  const { importPKCS8 } = await getJose();
  cachedPrivateKey = await importPKCS8(privatePem, 'RS256');
  return cachedPrivateKey;
};

const getPublicKey = async (): Promise<CryptoKey> => {
  if (cachedPublicKey) return cachedPublicKey;
  const publicPem = fs.readFileSync(path.resolve(env.JWT_SERVICE_PUBLIC_KEY_PATH), 'utf8');
  const { importSPKI } = await getJose();
  cachedPublicKey = await importSPKI(publicPem, 'RS256');
  return cachedPublicKey;
};

export class ServiceTokenService {
  static async signToken(payload: JwtPayload): Promise<string> {
    const privateKey = await getPrivateKey();
    const { SignJWT } = await getJose();

    const nowSec = Math.floor(Date.now() / 1000);
    const jti = crypto.randomUUID();

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid: 'main-key' })
      .setIssuer(env.JWT_ISSUER) // 谁签的
      .setSubject(payload.id) // 调用方是谁
      .setAudience(payload.aud) // 目标资源（被调用者）
      .setIssuedAt(nowSec)
      .setNotBefore(nowSec - 5) // 容忍轻微时钟漂移
      .setExpirationTime('1h')
      .setJti(jti)
      .sign(privateKey);

    return jwt;
  }

  static async verifyToken(token: string): Promise<ServiceJwtPayload> {
    try {
      const publicKey = await getPublicKey();
      const { jwtVerify } = await getJose();

      const { payload } = await jwtVerify(token, publicKey, {
        issuer: env.JWT_ISSUER,
      });

      return payload as ServiceJwtPayload;
    } catch (err: any) {
      if (err.code === 'ERR_JWT_EXPIRED') {
        logger.warn('Token expired', err);
      } else if (
        err.code === 'ERR_JWT_CLAIM_INVALID' ||
        err.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED'
      ) {
        logger.error('JWT error during verification', err);
      } else {
        logger.error('Unexpected error verifying service token', err);
      }

      throw new UnauthorizedError('Invalid or expired service token');
    }
  }
}
