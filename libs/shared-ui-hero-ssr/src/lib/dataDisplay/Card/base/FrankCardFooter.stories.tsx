import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankCardFooter } from './FrankCardFooter';
import { FrankCard } from './FrankCard';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/Base/FrankCardFooter',
  component: FrankCardFooter,
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
} satisfies Meta<typeof FrankCardFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is card footer!',
  },
  render: args => (
    <FrankCard>
      <FrankCardFooter {...args} />
    </FrankCard>
  ),
};
