import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddressListMapView } from './AddressListMapView';
import { useRuntimeConfig } from '@frankjhub/shared-ui-core';
import { FrankTabs } from '../../navigation';
import { FrankGoogleMapAddress } from './FrankGoogleMap';

const addresses: FrankGoogleMapAddress[] = [
  {
    id: '101',
    address: '100 Queen St W, Toronto, ON',
    label: 'Toronto City Hall',
    rating: 4.4,
    user_ratings_total: 108,
  },
  {
    id: '102',
    address: '290 Bremner Blvd, Toronto, ON',
    label: 'CN Tower',
    rating: 4.5,
    user_ratings_total: 109,
  },
  {
    id: '103',
    address: '40 Bay St.Toronto, Toronto, ON',
    label: 'Scotiabank Arena',
    rating: 4.6,
    user_ratings_total: 110,
  },
  {
    id: '104',
    address: '288 Bremner Blvd, Toronto, ON',
    label: "Ripley's Aquarium of Canada",
    rating: 4.7,
    user_ratings_total: 111,
  },
  {
    id: '105',
    address: '294 Bremner Blvd, Toronto, ON',
    label: 'Bobbie Rosenfeld Park',
    rating: 4.8,
    user_ratings_total: 112,
  },
  {
    id: '106',
    address: '255 Bremner Blvd, Toronto, ON',
    label: 'Toronto Railway Museum',
    rating: 4.9,
    user_ratings_total: 113,
  },
  {
    id: '107',
    address: '75 Lower Simcoe St, Toronto, ON',
    label: 'Char No.5 Whisky & Cocktail Lounge',
    rating: 4.3,
    user_ratings_total: 114,
  },
  {
    id: '108',
    address: '255 Front St W, Toronto, ON',
    label: 'Second Cup Café',
    rating: 4.2,
    user_ratings_total: 115,
  },
  {
    id: '109',
    address: '155 Wellington St W, Toronto, ON',
    label: 'RBC Centre',
    rating: 4.1,
    user_ratings_total: 116,
  },
];

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
    width: 1400,
    height: 400,
    popupWindowHeight: 287,
    popupWindowWidth: 329,
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
    addresses,
  },
};

export const ExitTest: Story = {
  args: {
    addresses,
  },
  decorators: [
    (Story, context) => {
      const { googleMapApiKey, googleMapId } = useRuntimeConfig();
      return (
        <div>
          <FrankTabs
            ariaLable="test"
            tabsData={[
              {
                key: 'map',
                title: 'Map',
                content: (
                  <Story
                    args={{
                      ...context.args,
                      googleMapApiKey: googleMapApiKey,
                      googleMapId,
                    }}
                  />
                ),
              },
              {
                key: 'exit',
                title: 'Exit',
                content: <div className="bg-red-200">Map mock exit</div>,
              },
            ]}
          />
        </div>
      );
    },
  ],
};
