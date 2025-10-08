import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TableWithSearchAndFilter,
  TableWithSearchAndFilterProps,
} from './TableWithSearchAndFilter';

interface Data {
  id: string;
  name: string;
  orgTypeName: string;
  description: string;
}

const data: Data[] = [
  {
    id: '1',
    name: 'Platform',
    orgTypeName: 'Platform',
    description: 'test platform description',
  },
  {
    id: '2',
    name: 'Eye Clinic',
    orgTypeName: 'Clinic',
    description: 'test eye clinic description',
  },
  {
    id: '3',
    name: 'Foot Clinic',
    orgTypeName: 'Clinic',
    description: 'test foot clinic description',
  },
];

const columns = [
  {
    name: 'Name',
    uid: 'name',
    sortable: true,
  },
  {
    name: 'Organization Type',
    uid: 'orgTypeName',
    sortable: true,
  },
  {
    name: 'Description',
    uid: 'description',
  },
  {
    name: 'Delete',
    uid: 'delete',
  },
];

const TableWithSearchAndFilterForData = (props: TableWithSearchAndFilterProps<Data>) => (
  <TableWithSearchAndFilter<Data> {...props} />
);

const meta = {
  title: 'Shared-UI-Hero-Client/Table/General/TableWithSearchAndFilter',
  component: TableWithSearchAndFilterForData,
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
} satisfies Meta<typeof TableWithSearchAndFilterForData>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'async paginated invitation data',
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
    currentPage: 1,
    pageCount: 10,
    handlePageChange: page => {
      console.log('page change to ===> ', page);
    },
    handleSortChange: () => {
      console.log('sort changed');
    },
    headerColumns: columns,
    status: 'idle',
    all: data,
    renderCell: (item, key) => {
      const cellValue = item[key as keyof Data];
      return cellValue;
    },
    openModal: undefined,
    setOpenModal: () => {
      console.log('set openModal function');
    },
    emptyContent: 'No invitation found',
  },
  render: args => (
    <div className="w-[800px]">
      <TableWithSearchAndFilterForData {...args} />
    </div>
  ),
};
