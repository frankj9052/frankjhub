/** 常见头、cookie、路径等常量 */
export const HttpHeaders = {
  REQUEST_ID: 'x-request-id',
  FORWARDED_USER: 'x-forwarded-user',
  FORWARDED_SERVICE: 'x-forwarded-service',
  FORWARDED_SCOPES: 'x-forwarded-scopes',
  API_KEY: 'x-api-key',
  PRINCIPAL_TYPE: 'x-principal-type',
  COOKIE: 'cookie',
  GATEWAY: 'x-gateway',
  CONTENT_TYPE: 'content-type',
} as const;

export const CookieNames = {
  SESSION: 'sid',
} as const;

export const Paths = {
  GATEWAY_MATCH: '/__gateway/match',
  REGISTRY_SNAPSHOT: '/api/registry/snapshot',
} as const;
