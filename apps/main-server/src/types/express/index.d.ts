// types/express/index.d.ts
// 把你的文件改成下面的结构（关键点是 先 import 'express-session' 再 declare module；这样 TypeScript 会先加载原始声明，再做增量合并）：
import 'express-session';
import 'express';
import { ServiceJwtPayload, UserPayload } from '@frankjhub/shared-schema';
// declare module 'express' {
declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;

    // currentUser payload
    currentUser?: UserPayload;
    serviceAuth?: ServiceJwtPayload;
    rawBody?: string;
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
