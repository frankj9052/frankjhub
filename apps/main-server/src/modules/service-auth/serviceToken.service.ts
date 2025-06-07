// RS256 签名 / 验证 JWT 的核心逻辑
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { createLoggerWithContext } from '../common/libs/logger';

const logger = createLoggerWithContext('ServiceTokenService');

let cachedPrivateKey: CryptoKey | null = null;
let cachedPublicKey: CryptoKey | null = null;

const getPrivateKey = async (): Promise<CryptoKey> => {
  if (cachedPrivateKey) return cachedPrivateKey;
  const privatePem = fs.readFileSync(path.resolve(env.JWT_SERVICE_PRIVATE_KEY_PATH), 'utf8');
  const { importPKCS8 } = await import('jose');
  cachedPrivateKey = await importPKCS8(privatePem, 'RS256');
  return cachedPrivateKey;
};

const getPublicKey = async (): Promise<CryptoKey> => {
  if (cachedPublicKey) return cachedPublicKey;
  const publicPem = fs.readFileSync(path.resolve(env.JWT_SERVICE_PUBLIC_KEY_PATH), 'utf8');
  const { importSPKI } = await import('jose');
  cachedPublicKey = await importSPKI(publicPem, 'RS256');
  return cachedPublicKey;
};

export interface ServiceTokenPayload {
  serviceId: string;
  scopes: string[];
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export class ServiceTokenService {
  static async signToken(payload: ServiceTokenPayload): Promise<string> {
    const privateKey = await getPrivateKey();
    const { SignJWT } = await import('jose');
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setIssuer(env.JWT_SERVICE_ISSUER)
      .sign(privateKey);
    return jwt;
  }

  static async verifyToken(token: string): Promise<ServiceTokenPayload> {
    try {
      const publicKey = await getPublicKey();
      const { jwtVerify } = await import('jose');
      const { payload } = await jwtVerify(token, publicKey, {
        issuer: env.JWT_SERVICE_ISSUER,
      });
      return payload as ServiceTokenPayload;
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
