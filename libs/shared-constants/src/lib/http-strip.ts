/**
 * 需要在反向代理、转发、或中间层中剥离的请求头
 * 用于防止伪造身份、污染上下文、或违反 hop-by-hop 规则。
 */
export const StripHeaders = [
  // 自定义转发头
  'x-forwarded-service',
  'x-forwarded-user',
  'x-forwarded-user-name',
  'x-forwarded-scopes',
  'x-principal-type',

  // 请求跟踪
  'x-request-id',
  'x-original-host',
  'x-original-url',

  // 标准 hop-by-hop headers
  'via',
  'forwarded',
  'te',
  'connection',
  'upgrade',
  'proxy-authorization',
  'proxy-authenticate',
  'transfer-encoding',
  'keep-alive',
  'trailer',
] as const;

export type StripHeader = (typeof StripHeaders)[number];
