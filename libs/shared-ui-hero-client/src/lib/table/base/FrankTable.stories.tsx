import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTable } from './FrankTable';
import { FrankTableBody } from './FrankTableBody';
import { FrankTableRow } from './FrankTableRow';
import { FrankTableCell } from './FrankTableCell';
import { FrankTableHeader } from './FrankTableHeader';
import { FrankTableColumn } from './FrankTableColumn';
import { BUTTON_COLORS, TableChildren } from '@frankjhub/shared-ui-hero-ssr';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/Base/FrankTable',
  component: FrankTable,
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
  argTypes: {
    color: {
      control: { type: 'select' },
      options: BUTTON_COLORS,
    },
  },
} satisfies Meta<typeof FrankTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (<div />) as TableChildren,
    ariaLabel: 'test table',
  },
  render: args => (
    <FrankTable {...args}>
      <FrankTableHeader>
        <FrankTableColumn>test header 1</FrankTableColumn>
      </FrankTableHeader>
      <FrankTableBody>
        <FrankTableRow>
          <FrankTableCell>test cell 1</FrankTableCell>
        </FrankTableRow>
      </FrankTableBody>
    </FrankTable>
  ),
};
