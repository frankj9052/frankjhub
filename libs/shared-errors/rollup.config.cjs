const { withNx } = require('@nx/rollup/with-nx');
const path = require('path');
const svg = require('@svgr/rollup');
const url = require('@rollup/plugin-url');
const { getExternalDeps } = require('./rollup.utils');

const externalDeps = getExternalDeps({
  pkgPath: path.resolve(__dirname, 'package.json'),
  srcPath: path.resolve(__dirname, 'src'),
  manual: ['react/jsx-runtime', '@frankjhub/shared-utils', '@frankjhub/shared-schema'],
});

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: './dist',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    external: externalDeps,
    format: ['esm', 'cjs'],
    assets: [
      { input: 'libs/shared-errors', output: '.', glob: 'README.md' },
      { input: 'libs/shared-errors/packageBuild', output: '.', glob: 'package.json' },
    ],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
    ],
    context: 'globalThis',
  }
);
