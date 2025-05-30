// types/express/index.d.ts
// 把你的文件改成下面的结构（关键点是 先 import 'express-session' 再 declare module；这样 TypeScript 会先加载原始声明，再做增量合并）：
import 'express';
declare module 'express' {
  interface Request {
    requestId?: string;
    currentUser?: {
      id: string;
    };
    session?: {
      destroy: (cb: () => void) => void;
    };
  }
}
