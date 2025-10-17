import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './Login.form';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Login/LoginForm',
  component: LoginForm,
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
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="w-[600px]">
      <LoginForm {...args} />
    </div>
  ),
};
