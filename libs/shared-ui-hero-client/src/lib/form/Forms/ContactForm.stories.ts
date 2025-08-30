import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContactForm } from './ContactForm';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/ContactForm',
  component: ContactForm,
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
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
