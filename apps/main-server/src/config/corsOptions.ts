// apps/main-server/src/config/corsOptions.ts
import cors, { CorsOptions, CorsOptionsDelegate, CorsRequest } from 'cors';
import { env } from './env';

// 规范化：去末尾斜杠 & 小写
const norm = (u: string) => u.trim().replace(/\/+$/, '').toLowerCase();

const isProd = env.NODE_ENV === 'production';

// 从环境变量读取白名单
const allowedSet = new Set((env.CORS_ORIGIN ?? '').split(',').map(norm).filter(Boolean));

// 开发环境放开本机
const devOriginRegex = /^https?:\/\/(localhost|127(?:\.0){2}\.1|\[::1\])(?::\d+)?$/i;

// 从请求头安全获取“请求到达该服务时认知的主机名”
function getReqHostname(req: CorsRequest): string | undefined {
  // 反向代理常见：X-Forwarded-Host 可能是 "a.com, b.com"
  const xf = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim();
  const host = (req.headers['host'] as string | undefined)?.trim();
  const picked = xf || host; // 优先使用代理头
  if (!picked) return undefined;
  return picked.split(':')[0].toLowerCase(); // 去掉端口
}

const corsDelegate: CorsOptionsDelegate<CorsRequest> = (req, callback) => {
  const origin = req.headers['origin'] as string | undefined;

  let allow = false;

  if (!origin) {
    // 无 Origin（curl/Postman/SSR 等）直接放行
    allow = true;
  } else {
    const o = norm(origin);

    // 开发环境允许 localhost/127.0.0.1/::1
    if (!isProd && devOriginRegex.test(o)) {
      allow = true;
    }

    // 环境变量白名单
    if (!allow && allowedSet.has(o)) {
      allow = true;
    }

    // 同源放行：Origin 的 hostname 与 请求 host 相同
    if (!allow) {
      try {
        const originHost = new URL(origin).hostname.toLowerCase();
        const reqHost = getReqHostname(req);
        if (originHost && reqHost && originHost === reqHost) {
          allow = true;
        }
      } catch {
        // 忽略 URL 解析错误
      }
    }
  }

  const opts: CorsOptions = {
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    // 允许时回显具体 Origin；不允许返回 false（不会抛 500，只是无 CORS 头）
    origin: allow && origin ? origin : false,
    optionsSuccessStatus: 204,
    // 不强制 allowedHeaders，默认让 CORS 回显请求的 Access-Control-Request-Headers 更省心
  };

  if (!allow && origin) {
    const reqUrl = (req as any).originalUrl || (req as any).url || '';
    console.warn('[CORS BLOCKED]', origin, '->', reqUrl);
  }

  callback(null, opts);
};

// 导出中间件
export const corsOptions = cors(corsDelegate);
// 预检
export const corsPreflight = cors(corsDelegate);
