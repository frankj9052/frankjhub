import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonShadcn } from './ButtonShadcn';

const meta = {
  title: 'Shared-UI-Shadcn/General/Button/Button',
  component: ButtonShadcn,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof ButtonShadcn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
