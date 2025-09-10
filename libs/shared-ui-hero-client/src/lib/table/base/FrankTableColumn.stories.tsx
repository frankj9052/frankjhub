import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTableColumn } from './FrankTableColumn';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTableColumn',
  component: FrankTableColumn,
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
} satisfies Meta<typeof FrankTableColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'test 123',
  },
};
