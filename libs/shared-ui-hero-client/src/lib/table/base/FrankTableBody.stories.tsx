import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTableBody } from './FrankTableBody';
import { FrankTableRow } from './FrankTableRow';
import { FrankTableCell } from './FrankTableCell';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTableBody',
  component: FrankTableBody,
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
} satisfies Meta<typeof FrankTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <FrankTableRow>
        <FrankTableCell>test</FrankTableCell>
      </FrankTableRow>
    ),
  },
};
