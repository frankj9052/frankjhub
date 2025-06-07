export type JoseModule = {
  // 🔐 JWT
  SignJWT: new (payload: object) => {
    setProtectedHeader(header: object): any;
    setIssuedAt(): any;
    setExpirationTime(exp: string): any;
    setIssuer(iss: string): any;
    setAudience(aud: string | string[]): any;
    sign(key: CryptoKey): Promise<string>;
  };
  jwtVerify: (
    token: string,
    key: CryptoKey | ((header: any) => Promise<CryptoKey>),
    options?: {
      issuer?: string;
      audience?: string | string[];
      algorithms?: string[];
    }
  ) => Promise<{ payload: any; protectedHeader: any }>;

  // 🔑 Key handling
  importPKCS8: (pem: string, alg: string) => Promise<CryptoKey>;
  importSPKI: (pem: string, alg: string) => Promise<CryptoKey>;
  importJWK: (jwk: Record<string, any>, alg?: string) => Promise<CryptoKey>;
  exportJWK: (key: CryptoKey) => Promise<Record<string, any>>;

  // 📦 JWKS
  createRemoteJWKSet: (url: URL) => (header: any, options?: any) => Promise<CryptoKey>;

  // ✍️ JWS (JSON Web Signature)
  CompactSign: new (payload: Uint8Array) => {
    setProtectedHeader(header: object): any;
    sign(key: CryptoKey): Promise<string>;
  };
  compactVerify: (
    jws: string,
    key: CryptoKey | ((header: any) => Promise<CryptoKey>)
  ) => Promise<{ payload: Uint8Array; protectedHeader: any }>;

  // 🔐 JWE (JSON Web Encryption)
  EncryptJWT: new (payload: object) => {
    setProtectedHeader(header: object): any;
    setIssuedAt(): any;
    setExpirationTime(exp: string): any;
    setAudience(aud: string | string[]): any;
    setIssuer(iss: string): any;
    encrypt(key: CryptoKey): Promise<string>;
  };
  jwtDecrypt: (
    token: string,
    key: CryptoKey,
    options?: { issuer?: string; audience?: string }
  ) => Promise<{ payload: any; protectedHeader: any }>;

  // 🧩 Flattened & General JSON JWS/JWE
  flattenJwsVerify?: any;
  generalJwsVerify?: any;
  flattenJweDecrypt?: any;
  generalJweDecrypt?: any;
};

let cachedJose: JoseModule | null = null;

/**
 * Dynamically loads the ESM-only `jose` module once and caches it for reuse.
 * Compatible with CommonJS or TypeScript projects not using `"type": "module"`.
 */
export async function getJose(): Promise<JoseModule> {
  if (!cachedJose) {
    cachedJose = (await import('jose')) as unknown as JoseModule;
  }
  return cachedJose;
}
