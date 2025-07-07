import path from 'path';
import fs from 'fs';
import { registry } from '../../../config/openapiRegistry';
import { createLoggerWithContext } from '../libs/logger';

interface ErrorConstructor {
  new (): any;
}

const logger = createLoggerWithContext('registerErrorResponsesFromFiles');

export function registerErrorResponsesFromFiles(errorDir: string) {
  logger.info(`📁 Scanning directory: ${errorDir}`);

  const files = fs.readdirSync(errorDir);
  logger.info(`📄 Files in directory: ${files.join(', ')}`);

  let totalErrorFiles = 0;
  let registeredCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of files) {
    // 支持 .ts 和 .js，过滤 BaseError
    if (!/Error\.(ts|js)$/.test(file) || file.includes('BaseError')) continue;

    totalErrorFiles++;
    const modulePath = path.join(errorDir, file);

    try {
      const module = require(modulePath);
      const exportedValues = Object.values(module);

      if (exportedValues.length === 0) {
        skippedCount++;
        logger.warn(`⚠️ ${file} does not export anything`);
        continue;
      }

      const exportedClass = exportedValues[0] as ErrorConstructor;

      if (typeof exportedClass !== 'function') {
        skippedCount++;
        logger.warn(`⚠️ ${file} does not export a class`);
        continue;
      }

      const instance = new exportedClass();
      const name = file.replace(/\.(ts|js)$/, '').replace('Error', '');

      if ('status' in instance && 'code' in instance && 'message' in instance) {
        registry.registerComponent('responses', name, {
          description: instance.message,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                [name]: {
                  value: {
                    status: instance.status,
                    code: instance.code,
                    message: instance.message,
                    timestamp: new Date().toISOString(),
                  },
                },
              },
            },
          },
        });
        registeredCount++;
        logger.info(`✅ Registered Error Response: ${name}`);
      } else {
        skippedCount++;
        logger.warn(`⚠️ ${file} missing required fields (status/code/message)`);
      }
    } catch (err) {
      failedCount++;
      logger.warn(`❌ Failed to instantiate or register error class from ${file}:`, err);
    }
  }

  logger.info(`🔍 Found ${totalErrorFiles} error files (excluding BaseError.*)`);
  logger.info(`✅ Registered ${registeredCount} error responses`);
  logger.info(`⚠️ Skipped ${skippedCount} files`);
  if (failedCount > 0) {
    logger.warn(`❌ ${failedCount} files failed to load`);
  }
}
