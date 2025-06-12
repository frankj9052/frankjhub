import type { Meta, StoryObj } from '@storybook/react';
import { FrankPopoverGeneral } from './FrankPopoverGeneral';

const meta = {
  title: 'Shared-UI-Hero-Client/Feedback/Popover/FrankPopoverGeneral',
  component: FrankPopoverGeneral,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple general-purpose popover component that toggles visibility by clicking the trigger element, without relying on external UI libraries. Supports basic layering control via z-index.',
      },
    },
    actions: {},
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Controlled open state of the popover.',
    },
    popoverTrigger: {
      control: false,
      description: 'The element that triggers the popover on click.',
    },
    popoverContent: {
      control: false,
      description: 'The content displayed inside the popover.',
    },
    zIndex: {
      control: { type: 'number' },
      description: 'z-index value for controlling the layering of the popover. Defaults to 10.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankPopoverGeneral>;

export default meta;
type Story = StoryObj<typeof meta>;

const InputTest = () => {
  return <input className="bg-red-200" />;
};

export const Default: Story = {
  args: {
    popoverTrigger: <InputTest />,
    popoverContent: <div className="bg-blue-200">test</div>,
  },
  decorators: [
    Story => {
      return (
        <div className="bg-gray-200 w-[500px] h-[500px] flex items-center justify-center">
          <Story />
        </div>
      );
    },
  ],
};
