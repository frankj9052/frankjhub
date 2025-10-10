import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreatePermissionForm } from './CreatePermissionForm';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Create/CreatePermissionForm',
  component: CreatePermissionForm,
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
} satisfies Meta<typeof CreatePermissionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="w-[800px]">
      <CreatePermissionForm {...args} />
    </div>
  ),
};
