import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveSwitch } from './ActiveSwitch';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/Switch/General/ActiveSwitch',
  component: ActiveSwitch,
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
} satisfies Meta<typeof ActiveSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
