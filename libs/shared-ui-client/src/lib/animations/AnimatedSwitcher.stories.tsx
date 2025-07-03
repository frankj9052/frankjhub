import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatedSwitcher } from './AnimatedSwitcher';

const meta = {
  title: 'Shared-UI-Client/Animations/AnimatedSwitcher',
  component: AnimatedSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A React component that cycles through child elements with smooth enter/exit animations using Framer Motion.',
      },
    },
    actions: {},
  },
  argTypes: {
    children: {
      control: false,
      description: 'An array of React nodes to rotate through.',
    },
    interval: {
      control: { type: 'number' },
      description: 'Time in milliseconds between each switch. Defaults to 3000.',
      defaultValue: 3000,
    },
  },
} satisfies Meta<typeof AnimatedSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    interval: 2000,
    children: [
      <span key="1" className="text-lg font-semibold text-blue-600">
        Primary Care
      </span>,
      <span key="2" className="text-lg font-semibold text-green-600">
        Dentist
      </span>,
      <span key="3" className="text-lg font-semibold text-purple-600">
        Pediatricians
      </span>,
      <span key="1" className="text-lg font-semibold text-blue-600">
        OBGYNs
      </span>,
      <span key="2" className="text-lg font-semibold text-green-600">
        Optometrists
      </span>,
    ],
  },
};
