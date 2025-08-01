const { withNx } = require('@nx/rollup/with-nx');
const pkg = require('./package.json');
const { builtinModules } = require('module');

const manuallyExternal = [];
const manuallyExcluded = [];

const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...builtinModules,
  ...manuallyExternal,
].filter(dep => !manuallyExcluded.includes(dep));

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: './dist',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    format: ['cjs', 'esm'],
    assets: [
      { input: 'libs/shared-utils', output: '.', glob: '*.md' },
      { input: 'libs/shared-utils/packageBuild', output: '.', glob: 'package.json'}
    ],
    external: externalDeps,
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
  }
);
