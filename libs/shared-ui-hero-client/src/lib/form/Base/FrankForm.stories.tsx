import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankForm } from './FrankForm';
import { FrankInput } from '../FormFields/Input/FrankInput';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Base/FrankForm',
  component: FrankForm,
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
} satisfies Meta<typeof FrankForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <FrankInput
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          name="email"
          type="email"
          size="sm"
        />
      </div>
    ),
  },
};
