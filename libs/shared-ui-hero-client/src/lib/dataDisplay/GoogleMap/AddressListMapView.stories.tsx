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
      { id: '104', address: '288 Bremner Blvd, Toronto, ON', label: "Ripley's Aquarium of Canada" },
      { id: '105', address: '294 Bremner Blvd, Toronto, ON', label: 'Bobbie Rosenfeld Park' },
      { id: '106', address: '255 Bremner Blvd, Toronto, ON', label: 'Toronto Railway Museum' },
      {
        id: '107',
        address: '75 Lower Simcoe St, Toronto, ON',
        label: 'Char No.5 Whisky & Cocktail Lounge',
      },
      { id: '108', address: '255 Front St W, Toronto, ON', label: 'Second Cup Café' },
      { id: '109', address: '155 Wellington St W, Toronto, ON', label: 'RBC Centre' },
    ],
  },
};
