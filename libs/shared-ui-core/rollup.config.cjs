const { withNx } = require('@nx/rollup/with-nx');
const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');
const { getExternalDeps } = require('./rollup.utils');
const path = require('path');
// const postcss = require('rollup-plugin-postcss');

const externalDeps = getExternalDeps({
  pkgPath: path.resolve(__dirname, 'package.json'),
  srcPath: path.resolve(__dirname, 'src'),
  manual: ['react/jsx-runtime', '@frankjhub/shared-utils'],
});

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: './dist',
    tsConfig: './tsconfig.lib.json',
    compiler: 'babel',
    external: externalDeps,
    format: ['esm', 'cjs'],
    assets: [
      { input: 'libs/shared-ui-core', output: '.', glob: 'README.md' },
      { input: 'libs/shared-ui-core/packageBuild', output: '.', glob: 'package.json' },
    ],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    plugins: [
      // postcss({
      //   modules: {
      //     generateScopedName: '[name]__[local]___[hash:base64:5]',
      //   }, // 处理 .module.css 文件
      //   extract: 'index.css', // 方案一（推荐）：使用 .css 提取 + next.config.js 配合 css-loader
      //   minimize: true,
      //   sourceMap: false,
      //   namedExports: true,
      //   parser: require('postcss-safe-parser'),
      //   plugins: [
      //     {
      //       postcssPlugin: 'logger',
      //       Once() {
      //         console.log('✅ [postcss] CSS module is processed with inject: true');
      //       },
      //     },
      //   ],
      // }),
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
