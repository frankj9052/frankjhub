import { execSync } from 'child_process';
import path from 'path';
import chalk from 'chalk';

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

const projectRoot = path.resolve(__dirname, '..');
const dataSourcePath = isProd
  ? path.join(projectRoot, 'dist', 'apps', 'main-server', 'config', 'data-source.js')
  : path.join(projectRoot, 'apps', 'main-server', 'src', 'config', 'data-source.ts');

const args = process.argv.slice(2).join(' ');
const tsxFlags = ['-r', 'reflect-metadata', '-r', 'tsconfig-paths/register'].join(' ');

console.log(chalk.cyan(`\n[TypeORM] Running command in ${env} mode:`));
console.log(chalk.gray(`> Using DataSource: ${dataSourcePath}`));
console.log(chalk.gray(`> CLI Args: ${args}\n`));

try {
  execSync(`tsx ${tsxFlags} ./node_modules/typeorm/cli.js -d ${dataSourcePath} ${args}`, {
    stdio: 'inherit',
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: env },
  });
} catch (err) {
  console.error(chalk.red('[TypeORM] Error during command execution.'));
  process.exit(1);
}
