import { env } from './env';

const rawOrigins = env.CORS_ORIGIN;
const allowedOrigins = rawOrigins
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean); // 去除空字符串

export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // 没有 origin（比如 Postman / curl 测试）
      return callback(null, true);
    }

    // 允许所有 localhost (带任意端口)
    if (/^http:\/\/localhost(:\d+)?$/i.test(origin)) {
      return callback(null, true);
    }

    // 允许 env 里配置的其它域名
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 其它情况拒绝
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
