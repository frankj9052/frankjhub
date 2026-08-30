import '@styles/global';
import type { Preview } from '@storybook/react-vite';
import { HeroUIProvider } from '@heroui/react';
import { RuntimeConfigProvider } from '@frankjhub/shared-ui-core';

const GOOGLE_MAPS_API_KEY = import.meta.env.STORYBOOK_GOOGLE_MAPS_API_KEY ?? '';

const GOOGLE_MAP_ID = import.meta.env.STORYBOOK_GOOGLE_MAP_ID ?? '';

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
    options: {
      storySort: {
        order: ['Introduction', 'Components', '...'],
      },
    },
    viewMode: 'docs',
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
