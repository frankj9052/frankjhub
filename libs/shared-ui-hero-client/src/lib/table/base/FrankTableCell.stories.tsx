import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTableCell } from './FrankTableCell';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTableCell',
  component: FrankTableCell,
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

  args: {},
  argTypes: {},
} satisfies Meta<typeof FrankTableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="w-[200px] h-[100px] bg-red-200">table cell 1</div>,
  },
};
