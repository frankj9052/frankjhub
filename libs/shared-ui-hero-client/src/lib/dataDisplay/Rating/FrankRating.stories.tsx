import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankRating } from './FrankRating';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Rating/FrankRating',
  component: FrankRating,
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
} satisfies Meta<typeof FrankRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 2.5,
    maxRating: 5,
    size: 24,
  },
};
