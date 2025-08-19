import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankGoogleMap } from './FrankGoogleMap';
import { useRuntimeConfig } from '@frankjhub/shared-ui-core';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/FrankGoogleMap',
  component: FrankGoogleMap,
  tags: ['autodocs'],
  parameters: {
    // layout: 'fullscreen',
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankGoogleMap is a reusable React component that displays an interactive Google Map with markers generated from address data. It uses the latest Google Maps JavaScript API with AdvancedMarkerElement for modern marker rendering and automatically adjusts the view to fit all provided locations.',
      },
    },
    actions: {},
  },
  argTypes: {
    googleMapApiKey: {
      control: 'text',
      description: 'Google Maps JavaScript API Key',
    },
    addresses: {
      control: 'object',
      description: 'Array of marked addresses',
    },
  },
  args: {
    googleMapApiKey: '',
    googleMapId: '',
    popupWindowHeight: 130,
    popupWindowWith: 200,
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
} satisfies Meta<typeof FrankGoogleMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 1000,
    height: 600,
    addresses: [
      { id: '101', address: '100 Queen St W, Toronto, ON', label: 'Toronto City Hall' },
      { id: '102', address: '290 Bremner Blvd, Toronto, ON', label: 'CN Tower' },
      { id: '103', address: '40 Bay St.Toronto, Toronto, ON', label: 'Scotiabank Arena' },
    ],
    hoveredAddressId: '101',
  },
};
