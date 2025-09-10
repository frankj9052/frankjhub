import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankActionsDropdown } from './FrankActionsDropdown';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Dropdown/General/FrankActionsDropdown',
  component: FrankActionsDropdown,
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
} satisfies Meta<typeof FrankActionsDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    actions: [
      {
        key: 'view',
        onPress: () => {
          alert('clicked view');
        },
        label: 'View',
        textValue: 'view',
      },
      {
        key: 'edit',
        onPress: () => {
          alert('clicked edit');
        },
        label: 'Edit',
        textValue: 'edit',
      },
      {
        key: 'delete',
        onPress: () => {
          alert('clicked delete');
        },
        label: 'Delete',
        textValue: 'delete',
      },
    ],
  },
};
