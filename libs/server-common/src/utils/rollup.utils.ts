import fs from 'fs';
import path from 'path';
import { builtinModules } from 'module';

const visitedFiles = new Set<string>();

/**
 * 获取依赖项（dependencies + peerDependencies）
 */
function getPackageDeps(packageJsonPath: string): string[] {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };

  return [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];
}

/**
 * 判断是否应忽略某个文件（测试、stories）
 */
function shouldIgnore(filePath: string): boolean {
  return /\.(spec|test|stories)\.(t|j)sx?$/.test(path.basename(filePath));
}

/**
 * 从源码中提取非相对路径的导入模块名（按包名）
 */
function extractImportsFromSource(sourceDir: string): string[] {
  const allImports = new Set<string>();

  function walk(dir: string): void {
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

export interface GetExternalDepsOptions {
  pkgPath: string;
  srcPath: string;
  manual?: string[];
}

/**
 * 获取 Rollup external 配置列表（支持缓存 + 自动扫描）
 */
export function getExternalDeps(options: GetExternalDepsOptions): string[] {
  const { pkgPath, srcPath, manual = [] } = options;
  visitedFiles.clear();

  const packageDeps = getPackageDeps(pkgPath);
  const sourceImports = extractImportsFromSource(srcPath);

  const external = new Set<string>([
    ...packageDeps,
    ...sourceImports,
    ...builtinModules,
    ...manual,
  ]);

  return Array.from(external);
}
