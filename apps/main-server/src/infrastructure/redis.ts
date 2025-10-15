import Redis, { RedisOptions } from 'ioredis';
import { env } from '../config/env';
import { createLoggerWithContext } from '../modules/common/libs/logger';

const logger = createLoggerWithContext('Redis');
export let isRedisAvailable = true;

const url = env.REDIS_URL;
if (!url) {
  logger.error('[Redis] REDIS_URL is not set');
}
const isTLS = url.startsWith('rediss://'); // 只在 rediss:// 才开 TLS

const baseOptions: RedisOptions = {
  // 不要默认传 tls，除非 rediss
  ...(isTLS
    ? {
        tls: {
          /* 可按需添加 rejectUnauthorized: true */
        },
      }
    : {}),
  // 连接体验/容错
  connectTimeout: 5000,
  enableReadyCheck: true,
  lazyConnect: false, // 如需懒连接可改 true，并在 connectRedis() 调 redisClient.connect()
  maxRetriesPerRequest: null, // 必须null,因为用了bullMQ
  retryStrategy(times) {
    // 3000ms 递增上限 10s，加一点抖动
    const delay = Math.min(times * 3000, 10000);
    const jitter = Math.floor(Math.random() * 300);
    logger.warn(`⚠️ Reconnect attempt #${times}, retrying in ${delay + jitter} ms`);
    return delay + jitter;
  },
};
export const redisClient = new Redis(url, baseOptions);

// 只绑定一次的事件监听
let listenersWired = false;
function wireListenersOnce() {
  if (listenersWired) return;
  listenersWired = true;

  redisClient.on('connect', () => logger.info('🔌 TCP connected.'));
  redisClient.on('ready', () => {
    isRedisAvailable = true;
    logger.info('🔁 Connection ready.');
  });
  redisClient.on('error', err => {
    isRedisAvailable = false;
    logger.error('❗ Connection error', err);
  });
  redisClient.on('end', () => {
    isRedisAvailable = false;
    logger.warn('🔌 Connection closed.');
  });
}
wireListenersOnce();

export async function connectRedis() {
  // 打印一下连接目标（隐藏密码），便于确认是否还在连 Upstash
  const masked = url.replace(/:[^@]*@/, ':***@');
  logger.info(`🔌 Connecting... (${masked})`);

  try {
    // 若 lazyConnect=true，需要：await redisClient.connect();

    // 等待 ready
    if (redisClient.status !== 'ready') {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onError = (e: any) => {
          cleanup();
          reject(e);
        };
        const cleanup = () => {
          redisClient.off('ready', onReady);
          redisClient.off('error', onError);
        };
        redisClient.once('ready', onReady);
        redisClient.once('error', onError);
      });
    }

    // 验证连通性
    const pong = await redisClient.ping();
    if (pong !== 'PONG') throw new Error('Redis ping failed');

    isRedisAvailable = true;
    logger.info('✅ Connection established and ping verified.');
  } catch (error) {
    isRedisAvailable = false;
    logger.error('❌ Failed to connect or ping Redis', error);
    // throw error; // 上抛给调用方感知启动失败(可选)
  }
}

export async function closeRedisConnection() {
  if (redisClient) {
    logger.info('🧹 Closing connection...');
    try {
      await redisClient.quit();
      logger.info('🛑 Connection closed cleanly.');
    } catch (error) {
      logger.error('❗ Error while closing connection', error);
    }
  }
}
