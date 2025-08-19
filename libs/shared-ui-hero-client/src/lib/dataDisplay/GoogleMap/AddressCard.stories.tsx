import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddressCard } from './AddressCard';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/AddressCard',
  component: AddressCard,
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
  argTypes: {},
  args: {},
} satisfies Meta<typeof AddressCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 300,
    address: '100 Queen St W, Toronto, ON',
    label: 'Toronto City Hall',
    selected: false,
    hovered: false,
  },
};
