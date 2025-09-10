import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTableHeader } from './FrankTableHeader';
import { FrankTableColumn } from './FrankTableColumn';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTableHeader',
  component: FrankTableHeader,
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
} satisfies Meta<typeof FrankTableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <FrankTableColumn>column test</FrankTableColumn>,
  },
};
