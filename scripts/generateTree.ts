import { writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function getCurrentDirname(metaUrl: string) {
  return dirname(fileURLToPath(metaUrl));
}
// 当前脚本所在目录
const __dirname = getCurrentDirname(import.meta.url);

// 扫描的根目录（上一级）
const targetDir = resolve(__dirname, '..');

// 输出文件路径
const outputPath = resolve(__dirname, '../structure.md');

// ✅ 配置：自定义排除规则
const exclude = {
  // 顶层排除目录
  topLevelDirs: ['dist', 'node_modules', '.git', '.cache', '.next', 'logs', '.nx', 'tmp'],
  // 精细排除的路径（相对于targetDir）
  exactPaths: [
    '.husky/_',
    'apps/main-server/dist',
    'apps/admin-portal/.next',
    'apps/clinic-portal/.next',
    'apps/patient-portal/.next',
    'apps/portfolio/.next',
    'libs/shared-schema/dist',
    'libs/shared-schema/node_modules',
    'libs/shared-errors/dist',
    'libs/shared-errors/node_modules',
    'libs/shared-ui-client/dist',
    'libs/shared-ui-client/node_modules',
    'libs/shared-ui-core/dist',
    'libs/shared-ui-core/node_modules',
    'libs/shared-ui-hero-client/dist',
    'libs/shared-ui-hero-client/node_modules',
    'libs/shared-ui-hero-ssr/dist',
    'libs/shared-ui-hero-ssr/node_modules',
    'libs/shared-ui-shadcn/node_modules',
    'libs/server-common/node_modules',
    'libs/shared-utils/dist',
    'libs/shared-utils/node_modules',
    'libs/shared-hooks/dist',
    'libs/shared-hooks/node_modules',
    'libs/storybook-host/node_modules',
    'libs/storybook-host/storybook-static',
  ], // 完整排除.husky/_下的所有文件
};

function shouldExclude(fullPath: string): boolean {
  const relativePath = relative(targetDir, fullPath).replace(/\\/g, '/'); // 统一用 /
  const parts = relativePath.split('/');

  // 1. 顶层目录排除，比如 dist/、node_modules/
  if (parts.length > 0 && exclude.topLevelDirs.includes(parts[0])) {
    return true;
  }

  // 2. 精确路径排除，比如 .husky/_ 目录
  for (const pathToExclude of exclude.exactPaths) {
    if (relativePath.startsWith(pathToExclude)) {
      return true;
    }
  }

  return false;
}

function generateTree(dir: string, prefix = ''): string {
  let tree = '';

  const items = readdirSync(dir).filter(item => {
    const fullPath = resolve(dir, item);
    return !shouldExclude(fullPath);
  });

  const lastIndex = items.length - 1;

  items.forEach((item, index) => {
    const fullPath = resolve(dir, item);
    const stats = statSync(fullPath);
    const isLast = index === lastIndex;
    const pointer = isLast ? '└── ' : '├── ';

    tree += `${prefix}${pointer}${item}\n`;

    if (stats.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree += generateTree(fullPath, newPrefix);
    }
  });

  return tree;
}

const treeContent = generateTree(targetDir);

const finalContent = '```plaintext\n' + treeContent + '\n```';

writeFileSync(outputPath, finalContent);

console.log(`✅ Directory structure saved to ${outputPath}`);
