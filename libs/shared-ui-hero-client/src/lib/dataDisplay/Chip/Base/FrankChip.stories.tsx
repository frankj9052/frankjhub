import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankChip } from './FrankChip';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Chip/Base/FrankChip',
  component: FrankChip,
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
} satisfies Meta<typeof FrankChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'New',
  },
};
