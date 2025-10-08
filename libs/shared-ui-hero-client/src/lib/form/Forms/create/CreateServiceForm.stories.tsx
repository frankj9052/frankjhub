import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreateServiceForm } from './CreateServiceForm';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Create/CreateServiceForm',
  component: CreateServiceForm,
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
} satisfies Meta<typeof CreateServiceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="w-[800px]">
      <CreateServiceForm {...args} />
    </div>
  ),
};
