import type { Meta, StoryObj } from '@storybook/react';
import { LinearGradientTextColor } from './LinearGradientTextColor';

const meta = {
  title: 'Shared-UI-Core/StaticEffects/LinearGradientTextColor',
  component: LinearGradientTextColor,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A text component that displays 'AI Powered' with a horizontal linear gradient, creating a colorful and visually striking effect.",
      },
    },
    actions: {},
  },

  args: {},
} satisfies Meta<typeof LinearGradientTextColor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
