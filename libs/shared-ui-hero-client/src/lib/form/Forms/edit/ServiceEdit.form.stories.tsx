import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceEditForm } from './ServiceEdit.form';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Edit/ServiceEditForm',
  component: ServiceEditForm,
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

  args: {
    onSubmit: values => {
      console.log('form submitted ===> ', values);
    },
  },
  argTypes: {},
} satisfies Meta<typeof ServiceEditForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
