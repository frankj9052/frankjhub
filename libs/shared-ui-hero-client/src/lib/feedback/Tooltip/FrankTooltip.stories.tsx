import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTooltip } from './FrankTooltip';

const meta = {
  title: 'Shared-UI-Hero-Client/Feedback/Tooltip/FrankTooltip',
  component: FrankTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '',
      },
    },
    actions: {},
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof FrankTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-primary p-4 cursor-pointer rounded-xl text-white select-none active:bg-secondary">
        Button
      </div>
    ),
    content: 'This is tooltip sample!',
    closeDelay: 0,
  },
};
