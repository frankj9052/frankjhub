import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddressListMapView } from './AddressListMapView';
import { useRuntimeConfig } from '@frankjhub/shared-ui-core';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/AddressListMapView',
  component: AddressListMapView,
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
  args: {
    googleMapApiKey: '',
    googleMapId: '',
    width: 1000,
    height: 400,
  },
  decorators: [
    (Story, context) => {
      const { googleMapApiKey, googleMapId } = useRuntimeConfig();
      return (
        <div>
          <Story
            args={{
              ...context.args,
              googleMapApiKey: googleMapApiKey,
              googleMapId,
            }}
          />
        </div>
      );
    },
  ],
} satisfies Meta<typeof AddressListMapView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    addresses: [
      { id: '101', address: '100 Queen St W, Toronto, ON', label: 'Toronto City Hall' },
      { id: '102', address: '290 Bremner Blvd, Toronto, ON', label: 'CN Tower' },
      { id: '103', address: '40 Bay St.Toronto, Toronto, ON', label: 'Scotiabank Arena' },
    ],
  },
};
