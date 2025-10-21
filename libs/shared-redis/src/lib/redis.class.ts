import Redis, { RedisOptions } from 'ioredis';
import type { Logger } from 'winston';
import { EnvRedis, EnvBase } from '@frankjhub/shared-schema';

/**
 * RedisService
 * 封装 ioredis 客户端的高可用连接管理、日志记录与生命周期控制。
 *
 * 主要功能：
 *  - 自动处理 TLS、连接重试与 ready 状态监听
 *  - 兼容 BullMQ（maxRetriesPerRequest 必须为 null）
 *  - 支持懒连接模式（lazyConnect）
 *  - 集成 winston 日志上下文
 *
 * 用法示例：
 * ```ts
 * const redisService = new RedisService(env, logger);
 * await redisService.connect();
 * const client = redisService.getClient();
 * await client.set('foo', 'bar');
 * ```
 */
export class RedisService<T extends EnvRedis & EnvBase> {
  private client: Redis; // ioredis 实例
  private logger: Logger; // 带上下文的 winston 日志
  private isAvailable = true; // Redis 是否处于可用状态
  private maskedUrl: string; // 掩码后的 Redis 连接 URL（隐藏密码）

  /**
   * 构造函数
   * @param env 环境变量对象，需包含 REDIS_URL、NODE_ENV 等
   * @param logger winston 日志实例
   * @param options 可选项：
   *   - lazyConnect：是否延迟连接（默认 false）
   *   - extraOptions：可追加的 RedisOptions
   */
  constructor(
    env: T,
    logger: Logger,
    options?: { lazyConnect?: boolean; extraOptions?: RedisOptions }
  ) {
    this.logger = logger.child({ context: 'Redis' });
    const url = env.REDIS_URL;
    if (!url) this.logger.error('[Redis] REDIS_URL is not set');
    this.maskedUrl = url?.replace(/:[^@]*@/, ':***@') ?? '';
    const isTLS = url?.startsWith('rediss://') ?? false;

    const baseOptions: RedisOptions = {
      ...(isTLS
        ? {
            tls: {
              /* 可按需添加 rejectUnauthorized: true */
            },
          }
        : {}),
      connectTimeout: 5000, // 连接超时（ms）
      enableReadyCheck: true, // ready 检查
      lazyConnect: options?.lazyConnect ?? false, // 懒连接支持
      maxRetriesPerRequest: null, // 必须为 null，BullMQ 要求
      retryStrategy(times) {
        // 重连策略（线性+抖动）
        const delay = Math.min(times * 3000, 10000);
        const jitter = Math.floor(Math.random() * 300);
        logger.warn(`⚠️ Reconnect attempt #${times}, retrying in ${delay + jitter} ms`);
        return delay + jitter;
      },
    };

    // 合并用户自定义配置
    const finalOpts = { ...options?.extraOptions, ...baseOptions };
    // 初始化 Redis 客户端
    this.client = new Redis(url ?? '', finalOpts);
    // 注册事件监听
    this.wireListeners();
  }

  /**
   * 注册 Redis 事件监听器
   * 包含 connect、ready、error、end 等事件
   */
  private wireListeners() {
    this.client.on('connect', () => this.logger.info('🔌 TCP connected.'));
    this.client.on('ready', () => {
      this.isAvailable = true;
      this.logger.info('🔁 Connection ready.');
    });
    this.client.on('error', err => {
      this.isAvailable = false;
      this.logger.error('❗ Connection error', err);
    });
    this.client.on('end', () => {
      this.isAvailable = false;
      this.logger.warn('🔌 Connection closed.');
    });
  }

  /**
   * 主动连接 Redis（用于 lazyConnect 或启动阶段验证）
   * 会等待 ready 事件并验证 ping 响应。
   */
  async connect() {
    this.logger.info(`🔌 Connecting... (${this.maskedUrl})`);
    // 若当前状态不是 ready，则等待 ready 或 error
    if (this.client.status !== 'ready') {
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
          this.client.off('ready', onReady);
          this.client.off('error', onError);
        };
        this.client.once('ready', onReady);
        this.client.once('error', onError);
      });
    }
    // 验证 Redis 是否可用
    const pong = await this.client.ping();
    if (pong !== 'PONG') throw new Error('Redis ping failed');
    this.logger.info('✅ Connection established and ping verified.');
  }

  /**
   * 优雅关闭 Redis 连接
   * 建议在应用退出或测试 teardown 阶段调用
   */
  async close() {
    this.logger.info('🧹 Closing connection...');
    try {
      await this.client.quit();
      this.logger.info('🛑 Connection closed cleanly.');
    } catch (error) {
      this.logger.error('❗ Error while closing connection', error);
    }
  }

  /**
   * 获取原始 Redis 客户端
   * @returns Redis 实例，可直接使用 ioredis API
   */
  getClient(): Redis {
    return this.client;
  }

  /**
   * 获取连接状态
   * @returns { isAvailable, status }
   */
  getStatus() {
    return { isAvailable: this.isAvailable, status: this.client.status };
  }
}
