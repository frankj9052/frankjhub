/**
 * 公共日志类型定义（跨服务共享）
 * @package @frankjhub/shared-schema
 */

import { EnvBase } from '@frankjhub/shared-schema';
import type { Logger } from 'winston';

/**
 * 日志上下文信息
 * - 在任何日志调用中附带
 */
export type LogContext = {
  context?: string;
  requestId?: string;
  userId?: string;
};

/**
 * 日志等级
 * - 可以用于配置或 schema 验证（可选）
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

/**
 * 通用 Logger 接口契约
 * - 各服务的 LoggerService 应遵守这个结构
 * - 这样你可以在框架中依赖接口，而不关心实现细节
 */
export interface ILoggerService<T extends EnvBase = EnvBase> {
  /**
   * 获取基础 Winston Logger
   */
  getLogger(): Logger;

  /**
   * 根据模块名创建带 context 的子 logger
   */
  createLoggerWithContext(context: string): Logger;

  /**
   * 创建带 requestId / userId 的链路 logger
   */
  getRequestLogger(requestId: string, userId?: string): Logger;
}
