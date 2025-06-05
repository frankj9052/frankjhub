import path from 'path';
import fg from 'fast-glob';
import { env } from '../../../config/env';
import { createLoggerWithContext } from '../libs/logger';
import { BaseSeeder } from '../libs/BaseSeeder';

const logger = createLoggerWithContext('SeederLoader');
export async function loadSeeders(): Promise<Array<new () => BaseSeeder>> {
  const isProd = env.NODE_ENV === 'production';
  const cwd = path.resolve(__dirname, isProd ? '../../../modules' : '../..');
  const seedPatterns = isProd ? ['**/seeds/*-prod.seed.js'] : ['**/seeds/*.seed.js'];
  logger.info('🔍 Loading seeders...', {
    env: env.NODE_ENV,
    cwd,
    patterns: seedPatterns,
  });
  const seedFiles = (await fg(seedPatterns, { cwd, absolute: true })).sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b))
  );
  logger.info(`📦 Found ${seedFiles.length} seed file(s).`);
  const seeders: Array<new () => BaseSeeder> = [];

  for (const file of seedFiles) {
    try {
      // const mod = await import(pathToFileURL(file).href);
      const mod = require(file);
      const SeederClass = mod.default;
      if (typeof SeederClass === 'function') {
        // 断言为符合 BaseSeeder 构造函数
        seeders.push(SeederClass);
        logger.debug(`✅ Loaded seeder: ${SeederClass.name} (${path.basename(file)})`);
      } else {
        logger.warn(`⚠️ Skipped invalid seeder in "${file}"`);
      }
    } catch (err) {
      logger.warn(`❌ Failed to load seeder from "${file}"`, err);
    }
  }

  return seeders;
}
