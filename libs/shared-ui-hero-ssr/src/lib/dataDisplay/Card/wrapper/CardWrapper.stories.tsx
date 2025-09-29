import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardWrapper } from './CardWrapper';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/Wrapper/CardWrapper',
  component: CardWrapper,
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
} satisfies Meta<typeof CardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
