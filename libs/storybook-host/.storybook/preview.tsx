import '@styles/global';
import type { Preview } from '@storybook/react';
import { HeroUIProvider } from '@heroui/react';

const preview: Preview = {
  decorators: [
    Story => (
      <HeroUIProvider>
        <Story />
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
