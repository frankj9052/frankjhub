import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankGeneralTable, FrankGeneralTableProps } from './FrankGeneralTable';

// 包装：把泛型 T 固定为 Data, 防止Storybook 用 Meta<typeof FrankGeneralTable> 时，泛型 T 被擦除
// 解决args中renderCellForData type不匹配的问题
const FrankGeneralTableForData = (props: FrankGeneralTableProps<Data>) => (
  <FrankGeneralTable<Data> {...props} />
);

const meta = {
  title: 'Shared-UI-Hero-Client/Table/General/FrankGeneralTable',
  component: FrankGeneralTableForData,
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

  args: {
    ariaLabel: 'storybook table example',
  },
  argTypes: {
    renderCell: { control: false },
  },
} satisfies Meta<typeof FrankGeneralTableForData>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const renderCellForData: FrankGeneralTableProps<Data>['renderCell'] = (item, columnKey) => {
  const key = String(columnKey) as keyof Data | 'delete';

  switch (key) {
    case 'name':
      return item.name;
    case 'orgTypeName':
      return item.orgTypeName;
    case 'description':
      return item.description;
    case 'delete':
      return <button onClick={() => alert(`delete ${item.id}`)}>Delete</button>;
    default:
      return null;
  }
};

export const Default: Story = {
  args: {
    columns,
    data,
    renderCell: renderCellForData,
  },
};
