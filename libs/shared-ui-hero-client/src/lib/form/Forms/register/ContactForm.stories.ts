import type { Meta, StoryObj } from '@storybook/react-vite';
import { RootRegisterForm } from './RootRegisterForm';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Register/RootRegisterForm',
  component: RootRegisterForm,
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
} satisfies Meta<typeof RootRegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
