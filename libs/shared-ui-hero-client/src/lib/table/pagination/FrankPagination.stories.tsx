import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankPagination } from './FrankPagination';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Pagination/FrankPagination',
  component: FrankPagination,
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
} satisfies Meta<typeof FrankPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    total: 10,
    showControls: true,
    variant: 'light',
  },
};
