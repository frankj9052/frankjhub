import { createRequire } from 'node:module';
import type { StorybookConfig } from '@storybook/react-vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { join, dirname } from 'path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [
    '../src/*.mdx',
    '../../shared-ui-core/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../shared-ui-client/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../shared-ui-hero-ssr/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../shared-ui-hero-client/src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
    '../../shared-ui-shadcn/src/components/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  viteFinal: async config =>
    mergeConfig(config, {
      plugins: [react(), nxViteTsPaths()],
      resolve: {
        alias: {
          '@styles/global': join(__dirname, '../src/styles/globals.css'),
          '@api': path.resolve(__dirname, './mocks/mock-api.ts'),
          'next/navigation': path.resolve(__dirname, './mocks/mock-next-navigation.ts'),
          'next/link': path.resolve(__dirname, './mocks/mock-next-link.tsx'),
          'next/image': path.resolve(__dirname, './mocks/mock-next-image.tsx'),
        },
      },
    }),
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
