import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomPopup } from './CustomPopup';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/CustomPopup',
  component: CustomPopup,
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
} satisfies Meta<typeof CustomPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: true,
    address: '100 Queen St W, Toronto, ON',
    label: 'Toronto City Hall',
    width: 288,
    height: 314,
    rating: 3.3,
    userRatingsTotal: 183,
    linkLabel: 'View Clinic',
  },
};

export const Small: Story = {
  args: {
    selected: true,
    address: '100 Queen St W, Toronto, ON',
    label: 'Toronto City Hall',
    width: 200,
    height: 130,
    rating: 3.3,
    userRatingsTotal: 183,
    linkLabel: 'View Clinic',
  },
};
