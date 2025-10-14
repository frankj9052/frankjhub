import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankSwitch } from './FrankSwitch';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/Switch/Base/FrankSwitch',
  component: FrankSwitch,
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
} satisfies Meta<typeof FrankSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
