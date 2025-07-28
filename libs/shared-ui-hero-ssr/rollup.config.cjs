const { withNx } = require('@nx/rollup/with-nx');
const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');
const { getExternalDeps } = require('@frankjhub/server-common');
const path = require('path');

const externalDeps = getExternalDeps({
  pkgPath: path.resolve(__dirname, 'package.json'),
  srcPath: path.resolve(__dirname, 'src'),
  manual: [
    'react/jsx-runtime',
    '@frankjhub/shared-utils',
  ],
})

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: './dist',
    tsConfig: './tsconfig.lib.json',
    compiler: 'babel',
    external: externalDeps,
    format: ['esm', 'cjs'],
    assets: [
      { input: 'libs/shared-ui-hero-ssr', output: '.', glob: 'README.md' },
      { input: 'libs/shared-ui-hero-ssr/packageBuild', output: '.', glob: 'package.json'}
    ],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
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
