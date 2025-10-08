import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableTopDropdown } from './TableTopDropdown';

const meta = {
  title:
    'Shared-UI-Hero-Client/Table/General/TableWithSearchAndFilterParts/TopContentPars/TableTopDropdown',
  component: TableTopDropdown,
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
} satisfies Meta<typeof TableTopDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
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
};
