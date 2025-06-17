import path from 'path';
import fg from 'fast-glob';
import { env } from '../../../config/env';
import { createLoggerWithContext } from '../libs/logger';

const logger = createLoggerWithContext('FactoryLoader');

/**
 * 加载并注册所有工厂函数（setSeederFactory）
 * 工厂文件应导出默认的 factory 函数，并调用 setSeederFactory()
 */
export async function loadFactories(): Promise<void> {
  const isProd = env.NODE_ENV === 'production';

  // 设定根目录：生产环境使用构建后的 JS，开发环境使用 TS 源码
  const cwd = path.resolve(__dirname, isProd ? '../../../modules' : '../..');

  // 匹配所有 factory 文件：prod 匹配 .js，dev 匹配 .ts
  const factoryPatterns = ['**/factories/*.factory.{ts,js}'];

  logger.info('🔍 Loading factories...', {
    env: env.NODE_ENV,
    cwd,
    patterns: factoryPatterns,
  });

  // 获取所有匹配的 factory 文件，按文件名排序（可选，仅日志美观）
  const factoryFiles = (await fg(factoryPatterns, { cwd, absolute: true })).sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b))
  );

  logger.info(`📦 Found ${factoryFiles.length} factory file(s).`);

  // 加载每个 factory 文件：执行其中的 setSeederFactory() 注册逻辑
  for (const file of factoryFiles) {
    try {
      require(file); // 使用 require 保证同步加载、立即注册
      logger.debug(`✅ Registered factory: ${path.basename(file)}`);
    } catch (err) {
      logger.warn(`❌ Failed to load factory from "${file}"`, err);
    }
  }
}
