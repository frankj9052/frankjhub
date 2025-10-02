// JWT 校验 + scope 校验中间件

import { Request } from 'express';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { verifyServiceJwt } from '../service-auth/utils/verifyWithJwks';
import { ForbiddenError } from '../common/errors/ForbiddenError';
import { hasPermission } from '../permission/utils/hasPermission';

export async function verifyAccess(req: Request, expectedAudience: string | string[]) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) throw Object.assign(new UnauthorizedError('Missing token'), { status: 401 });

  // verifyServiceJwt 目前签名为 (token, expectedAudience: string)
  // 若 expectedAudience 是数组，按需遍历校验，任一通过即可
  const audiences = Array.isArray(expectedAudience) ? expectedAudience : [expectedAudience];
  let ok = false;
  let lastErr: any;
  for (const aud of audiences) {
    try {
      const payload = await verifyServiceJwt(token, aud);
      req.serviceAuth = payload;
      ok = true;
      break;
    } catch (error) {
      lastErr = error;
    }
  }
  if (!ok) {
    throw Object.assign(lastErr ?? new UnauthorizedError('Invalid token'), { status: 401 });
  }
}

export function checkScopes(req: Request, required: string[]) {
  const tokenScopes = String(req.serviceAuth?.scopes || '')
    .split(/[ ,]/)
    .filter(Boolean);
  // 校验所需权限作用域
  const missing = required.filter(required => !hasPermission(tokenScopes, required));
  if (missing.length) {
    const err: any = new ForbiddenError('Insufficient scope');
    err.status = 403;
    err.required = missing;
    throw err;
  }
}
