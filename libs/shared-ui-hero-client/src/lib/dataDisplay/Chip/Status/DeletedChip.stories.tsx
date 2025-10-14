import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeletedChip } from './DeletedChip';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Chip/Status/DeletedChip',
  component: DeletedChip,
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
} satisfies Meta<typeof DeletedChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDeleted: true,
  },
};
