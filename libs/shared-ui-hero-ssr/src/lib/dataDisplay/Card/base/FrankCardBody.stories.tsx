import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankCardBody } from './FrankCardBody';
import { FrankCard } from './FrankCard';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/Base/FrankCardBody',
  component: FrankCardBody,
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
} satisfies Meta<typeof FrankCardBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <FrankCard>
      <FrankCardBody {...args}>This is card body</FrankCardBody>
    </FrankCard>
  ),
};
