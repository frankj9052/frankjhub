import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomLocationMarker } from './CustomLocationMarker';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/GoogleMap/CustomLocationMarker',
  component: CustomLocationMarker,
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
} satisfies Meta<typeof CustomLocationMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hovered: false,
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    hovered: false,
    selected: true,
  },
};
