import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberRiser } from './NumberRiser';

const meta = {
  title: 'Shared-UI-Client/Animations/NumberRiser',
  component: NumberRiser,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "A React component that animates a number rising smoothly from 1 to a target value using Framer Motion's animation and viewport interaction hooks.",
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {
    number: {
      control: { type: 'number' },
      description: 'The target number value to animate up to.',
    },
    duration: {
      control: { type: 'number' },
      description: 'Duration of the animation in seconds. Defaults to 1.',
    },
  },
} satisfies Meta<typeof NumberRiser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    number: 20,
    duration: 1,
  },
};
