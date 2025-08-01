const fs = require('fs');
const path = require('path');
const { builtinModules } = require('module');

const visitedFiles = new Set();

/**
 * 获取依赖项（dependencies + peerDependencies）
 */
function getPackageDeps(packageJsonPath) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  return [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
}

/**
 * 判断是否应忽略某个文件（测试、stories）
 */
function shouldIgnore(filePath) {
  return /\.(spec|test|stories)\.(t|j)sx?$/.test(path.basename(filePath));
}

/**
 * 从源码中提取非相对路径的导入模块名（按包名）
 */
function extractImportsFromSource(sourceDir) {
  const allImports = new Set();

  function walk(dir) {
    if (visitedFiles.has(dir)) return;
    visitedFiles.add(dir);

    for (const file of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(file) && !shouldIgnore(file)) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        const importMatches = [
          ...content.matchAll(/(?:import\s+[^'"]+from\s+|require\()\s*['"]([^'"]+)['"]/g),
          ...content.matchAll(/import\s*['"]([^'"]+)['"]/g),
        ];

        for (const match of importMatches) {
          const rawImport = match[1];

          // 排除相对路径
          if (rawImport.startsWith('.') || rawImport.startsWith('/')) continue;

          const pkgName = rawImport.startsWith('@')
            ? rawImport.split('/').slice(0, 2).join('/')
            : rawImport.split('/')[0];

          allImports.add(pkgName);
        }
      }
    }
  }

  walk(sourceDir);
  return Array.from(allImports);
}

/**
 * 获取 Rollup external 配置列表（支持缓存 + 自动扫描）
 * @param {{ pkgPath: string, srcPath: string, manual?: string[] }} options
 * @returns {string[]}
 */
function getExternalDeps(options) {
  const { pkgPath, srcPath, manual = [] } = options;
  visitedFiles.clear();

  const packageDeps = getPackageDeps(pkgPath);
  const sourceImports = extractImportsFromSource(srcPath);

  const external = new Set([...packageDeps, ...sourceImports, ...builtinModules, ...manual]);

  return Array.from(external);
}

module.exports = {
  getExternalDeps,
};
