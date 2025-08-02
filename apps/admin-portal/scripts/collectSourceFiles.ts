import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 当前 Nx 子项目根目录（scripts/ 的上一级）
const projectRoot = resolve(__dirname, '..');
const outputFile = resolve(projectRoot, 'collected-source.txt');

// 配置
const config = {
  // 仅收集这些相对路径下的内容
  includeDirs: ['src', 'types'], // 相对 projectRoot

  // 排除这些路径（相对 projectRoot）
  excludePaths: ['src/test', 'src/__mocks__', 'src/**/*.spec.ts', 'src/**/*.test.ts'],

  // 支持的文件扩展
  extensions: ['.ts', '.js'],
};

// 判断是否应排除
function isExcluded(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/');
  return config.excludePaths.some(pattern =>
    new RegExp(
      '^' + pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\./g, '\\.') + '$'
    ).test(normalized)
  );
}

// 是否是支持的文件类型
function isSupportedFile(path: string): boolean {
  return config.extensions.includes(extname(path));
}

// 递归收集文件
function collectFiles(dir: string, collected: string[]) {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      collectFiles(fullPath, collected);
    } else if (stat.isFile()) {
      const rel = relative(projectRoot, fullPath).replace(/\\/g, '/');
      if (
        isSupportedFile(fullPath) &&
        config.includeDirs.some(d => rel.startsWith(d)) &&
        !isExcluded(rel)
      ) {
        collected.push(rel);
      }
    }
  }
}

// 运行主逻辑
function run() {
  const collectedFiles: string[] = [];

  for (const dir of config.includeDirs) {
    const fullDir = resolve(projectRoot, dir);
    if (!existsSync(fullDir)) {
      console.warn(`⚠️ Skipped missing includeDir: ${dir}`);
      continue;
    }
    collectFiles(fullDir, collectedFiles);
  }

  let output = '';
  for (const relPath of collectedFiles) {
    const absPath = resolve(projectRoot, relPath);
    const content = readFileSync(absPath, 'utf-8');
    output += `\n\n/* === FILE: ${relPath} === */\n\n${content}`;
  }

  writeFileSync(outputFile, output.trim());
  console.log(`✅ Collected ${collectedFiles.length} files`);
  console.log(`📄 Output written to: ${outputFile}`);
}

run();
