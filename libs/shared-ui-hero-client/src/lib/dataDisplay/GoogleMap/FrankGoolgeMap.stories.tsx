import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankGoogleMap } from './FrankGoogleMap';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/FrankGoogleMap',
  component: FrankGoogleMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '...',
      },
    },
    actions: {},
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof FrankGoogleMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
