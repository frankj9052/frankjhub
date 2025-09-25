import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankCard } from './FrankCard';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/Base/FrankCard',
  component: FrankCard,
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
} satisfies Meta<typeof FrankCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a card wrapper',
  },
};
