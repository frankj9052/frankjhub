import '@styles/global';
import type { Preview } from '@storybook/react-vite';
import { HeroUIProvider } from '@heroui/react';
import { RuntimeConfigProvider } from '@frankjhub/shared-ui-core';

// 兼容 vite / webpack 两种获取方式
const SB_ENV = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const GOOGLE_MAPS_API_KEY =
  SB_ENV.STORYBOOK_GOOGLE_MAPS_API_KEY || process.env.STORYBOOK_GOOGLE_MAPS_API_KEY || '';

const GOOGLE_MAP_ID = SB_ENV.STORYBOOK_GOOGLE_MAP_ID || process.env.STORYBOOK_GOOGLE_MAP_ID || '';

const preview: Preview = {
  decorators: [
    Story => (
      <HeroUIProvider>
        <RuntimeConfigProvider
          value={{
            googleMapApiKey: GOOGLE_MAPS_API_KEY,
            googleMapId: GOOGLE_MAP_ID,
          }}
        >
          <Story />
        </RuntimeConfigProvider>
      </HeroUIProvider>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  tags: ['autodocs'],
};

export default preview;
