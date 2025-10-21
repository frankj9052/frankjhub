import 'express';
import 'express-session';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
    serviceAuth?: {
      serviceId: string;
      scopes: string[];
      iss?: string;
      aud?: string | string[];
      iat?: number;
      exp?: number;
    };
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email?: string;
      userName: string;
      roleCodes: string[]; // 用于服务端权限判断
      permissionStrings: string[];
      sessionVersion: string; // 用于权限刷新机制（如权限变更后刷新 session）
    };
  }
}
