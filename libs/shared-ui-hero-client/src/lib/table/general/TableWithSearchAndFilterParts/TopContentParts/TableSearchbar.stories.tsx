import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableTopSearchbar } from './TableSearchbar';

const meta = {
  title:
    'Shared-UI-Hero-Client/Table/General/TableWithSearchAndFilterParts/TopContentPars/TableTopSearchbar',
  component: TableTopSearchbar,
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
} satisfies Meta<typeof TableTopSearchbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search by email',
    searchValue: '',
    onClear: () => {
      console.log('clear the searchbar');
    },
    onValueChange: value => {
      console.log('value change to ===> ', value);
    },
  },
  render: args => {
    return (
      <div className="w-[400px]">
        <TableTopSearchbar {...args} />
      </div>
    );
  },
};
