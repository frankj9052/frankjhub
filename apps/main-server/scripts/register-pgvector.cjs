// apps/main-server/scripts/register-pgvector.cjs
const { createRequire } = require('module');
const path = require('node:path');
const fs = require('node:fs');

(function patchPgVector() {
  try {
    const req = createRequire(__filename);

    // 1) 找到 typeorm 包入口和目录
    const typeormEntry = req.resolve('typeorm'); // .../node_modules/typeorm/index.js
    const typeormDir = path.dirname(typeormEntry);

    // 2) 兼容不同构建产物，定位 PostgresDriver 文件
    const candidates = [
      path.join(typeormDir, 'driver/postgres/PostgresDriver.js'),
      path.join(typeormDir, 'driver/postgres/PostgresDriver.cjs'),
      path.join(typeormDir, 'cjs/driver/postgres/PostgresDriver.js'),
      path.join(typeormDir, 'esm/driver/postgres/PostgresDriver.js'),
    ];
    const driverPath = candidates.find((p) => fs.existsSync(p));
    if (!driverPath) {
      throw new Error(
        `Cannot locate PostgresDriver. Tried:\n${candidates.join('\n')}\n` +
        `typeormDir resolved from: ${typeormEntry}`
      );
    }

    // 3) 读取模块与原始类
    const mod = req(driverPath);
    const OriginalDriver = mod.PostgresDriver || mod.default;
    if (typeof OriginalDriver !== 'function') {
      throw new Error('PostgresDriver is not a constructor');
    }

    // 4) 用子类替换：在构造器里补 vector
    class PatchedPostgresDriver extends OriginalDriver {
      constructor(...args) {
        super(...args);
        try {
          this.supportedDataTypes = this.supportedDataTypes || [];
          this.withLengthColumnTypes = this.withLengthColumnTypes || [];

          if (!this.supportedDataTypes.includes('vector')) {
            this.supportedDataTypes.push('vector');
          }
          if (!this.withLengthColumnTypes.includes('vector')) {
            this.withLengthColumnTypes.push('vector');
          }
        } catch (e) {
          // 忽略
        }
      }
    }

    // 5) 覆盖导出（确保后续 require 拿到的是我们改过的类）
    mod.PostgresDriver = PatchedPostgresDriver;
    if ('default' in mod) mod.default = PatchedPostgresDriver;

    console.log('[pgvector] PostgresDriver patched (class replaced):', driverPath);
  } catch (err) {
    console.warn('[pgvector] Failed to patch PostgresDriver:', err);
  }
})();
