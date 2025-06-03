import type { Meta, StoryObj } from '@storybook/react';
import { BreathingGlow } from './BreathingGlow';

const meta = {
  title: 'Aminations/BreathingGlow',
  component: BreathingGlow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A React component that applies a smooth breathing glow effect to its child elements using Framer Motion animations.',
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {
    children: {
      control: false,
      description: 'The content to apply the breathing glow effect to.',
    },
    duration: {
      control: { type: 'number' },
      description: 'Duration of one full breathing cycle in seconds. Defaults to 2.',
    },
  },
} satisfies Meta<typeof BreathingGlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="w-[13px] h-[13px] bg-[#27C6AA] rounded-full" />,
  },
};
