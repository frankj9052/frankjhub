import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveChip } from './ActiveChip';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Chip/Status/ActiveChip',
  component: ActiveChip,
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
} satisfies Meta<typeof ActiveChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    isActive: false,
  },
};
