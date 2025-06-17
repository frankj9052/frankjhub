import type { Meta, StoryObj } from '@storybook/react-vite';
import SharedUiShadcn from './shared-ui-shadcn';

const meta = {
  component: SharedUiShadcn,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof SharedUiShadcn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
