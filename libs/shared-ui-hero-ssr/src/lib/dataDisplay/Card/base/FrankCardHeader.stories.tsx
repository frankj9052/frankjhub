import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankCardHeader } from './FrankCardHeader';
import { FrankCard } from './FrankCard';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/Base/FrankCardHeader',
  component: FrankCardHeader,
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
} satisfies Meta<typeof FrankCardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is card header!',
  },
  render: args => (
    <FrankCard>
      <FrankCardHeader {...args} />
    </FrankCard>
  ),
};
