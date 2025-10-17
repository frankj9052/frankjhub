import { ZodType } from 'zod';
import dotenvFlow from 'dotenv-flow';

/**
 * ConfigService: 环境变量读取与类型安全校验
 * - 自动读取指定路径的 .env 文件
 * - 支持 Zod 校验和自定义逻辑
 * - 抛出错误时进程退出
 */
export class ConfigService<T extends Record<string, any>> {
  private env: T;

  /**
   * 构造函数
   * @param envPath 环境文件目录，默认 process.cwd()
   * @param schema Zod schema 用于校验
   */
  constructor(private schema: ZodType<T>, envPath?: string) {
    dotenvFlow.config({ path: envPath ?? process.cwd() });
    this.env = this.parseEnv();
  }

  /**
   * 内部方法：校验 process.env 并返回类型安全对象
   */
  private parseEnv(): T {
    const parsed = this.schema.safeParse(process.env);
    if (!parsed.success) {
      console.error('❌ Invalid environment variables!');
      console.error(parsed.error.format());
      process.exit(1);
    }
    return parsed.data;
  }

  /**
   * 获取校验后的环境变量对象
   */
  getEnv(): T {
    return this.env;
  }
}
