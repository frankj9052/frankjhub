import { EnvBase, EnvCors } from '@frankjhub/shared-schema';
import cors, { CorsOptions, CorsOptionsDelegate, CorsRequest } from 'cors';
/**
 * CorsService: 专业 CORS 中间件封装
 * - 支持环境变量白名单
 * - 开发环境 localhost/IP 自动放行
 * - 同源策略自动放行
 * - 阻止请求打印日志
 *
 * @template T Env 类型（必须继承 EnvBase）
 */
export class CorsService<T extends EnvBase & EnvCors> {
  private allowedSet: Set<string>;
  private isProd: boolean;

  constructor(env: T) {
    this.isProd = env.NODE_ENV === 'production';

    // 白名单处理
    const norm = (u: string) => u.trim().replace(/\/+$/, '').toLowerCase();
    this.allowedSet = new Set((env.CORS_ORIGIN ?? '').split(',').map(norm).filter(Boolean));
  }

  /** 开发环境自动放行 localhost/IP */
  private devOriginRegex = /^https?:\/\/(localhost|127(?:\.0){2}\.1|\[::1\])(?::\d+)?$/i;

  /** 同源策略判断 */
  // // 从请求头安全获取“请求到达该服务时认知的主机名”
  private getReqHostname(req: CorsRequest): string | undefined {
    // 反向代理常见：X-Forwarded-Host 可能是 "a.com, b.com"
    const xf = (req.headers['x-forwarded-host'] as string | undefined)?.split(',')[0]?.trim();
    const host = (req.headers['host'] as string | undefined)?.trim();
    const picked = xf || host; // 优先使用代理头
    if (!picked) return undefined;
    return picked.split(':')[0].toLowerCase(); // 去掉端口
  }

  /** 生成 CorsOptionsDelegate */
  private corsDelegate: CorsOptionsDelegate<CorsRequest> = (req, callback) => {
    const origin = req.headers['origin'] as string | undefined;

    let allow = false;

    if (!origin) {
      // 无 Origin（curl/Postman/SSR 等）直接放行
      allow = true;
    } else {
      // normalize-规范化：去末尾斜杠 & 小写
      const o = origin.trim().replace(/\/+$/, '').toLowerCase();

      // 开发环境允许 localhost/127.0.0.1/::1
      if (!this.isProd && this.devOriginRegex.test(o)) {
        allow = true;
      }

      // 环境变量白名单
      if (!allow && this.allowedSet.has(o)) {
        allow = true;
      }

      // 同源放行：Origin 的 hostname 与 请求 host 相同
      if (!allow) {
        try {
          const originHost = new URL(origin).hostname.toLowerCase();
          const reqHost = this.getReqHostname(req);
          if (originHost && reqHost && originHost === reqHost) {
            allow = true;
          }
        } catch {
          // 忽略 URL 解析错误
        }
      }
    }

    if (!allow && origin) {
      const reqUrl = (req as any).originalUrl || (req as any).url || '';
      console.warn('[CORS BLOCKED]', origin, '->', reqUrl);
    }

    const opts: CorsOptions = {
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      // 允许时回显具体 Origin；不允许返回 false（不会抛 500，只是无 CORS 头）
      origin: allow && origin ? origin : false,
      optionsSuccessStatus: 204,
      // 不强制 allowedHeaders，默认让 CORS 回显请求的 Access-Control-Request-Headers 更省心
    };

    callback(null, opts);
  };

  /** 获取 CORS 中间件 */
  getMiddleware() {
    return cors(this.corsDelegate);
  }

  /** 获取 CORS 预检中间件 */
  getPreflightMiddleware() {
    return cors(this.corsDelegate);
  }
}
