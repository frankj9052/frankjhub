import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTableRow } from './FrankTableRow';
import { FrankTableCell } from './FrankTableCell';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTableRow',
  component: FrankTableRow,
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
} satisfies Meta<typeof FrankTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <FrankTableCell>table cell test</FrankTableCell>,
  },
};
