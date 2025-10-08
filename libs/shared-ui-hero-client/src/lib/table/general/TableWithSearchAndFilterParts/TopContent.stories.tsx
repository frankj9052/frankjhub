import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopContent } from './TopContent';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/General/TableWithSearchAndFilterParts/TopContent',
  component: TopContent,
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
} satisfies Meta<typeof TopContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchbar: {
      placeholder: 'Search by email',
      searchValue: '',
      onClear: () => {
        console.log('clear the searchbar');
      },
      onValueChange: value => {
        console.log('value change to ===> ', value);
      },
    },
    filterList: [
      {
        trigger: 'Status',
        ariaLabel: 'status filter',
        selectedKey: new Set(''),
        selectionMode: 'multiple',
        onSelectionChange: keys => {
          console.log('selected key changed ===> ', keys.toString());
        },
        dropdownItems: [
          {
            uid: 'isActive',
            name: 'isActive',
          },
          {
            uid: 'deleted',
            name: 'isDeleted',
          },
        ],
      },
    ],
    columnSelection: {
      selectedKey: new Set(''),
      onSelectionChange: keys => {
        console.log('column selection changed ===> ', keys.toString());
      },
      dropdownItems: [
        {
          uid: 'userName',
          name: 'userName',
        },
        {
          uid: 'address',
          name: 'address',
        },
      ],
    },
    total: 20,
    handlePageSizeChange: e => {
      console.log('page size change to ===> ', e.target.value);
    },
    limit: 0,
    CreateForm: () => <form>This is create form</form>,
  },
  render: args => (
    <div className="w-[800px]">
      <TopContent {...args} />
    </div>
  ),
};
