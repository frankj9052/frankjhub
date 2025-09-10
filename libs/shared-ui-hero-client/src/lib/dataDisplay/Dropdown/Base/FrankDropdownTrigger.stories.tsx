import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankDropdownTrigger } from './FrankDropdownTrigger';
import { FrankDropdown } from './FrankDropdown';
import { FrankDropdownMenu } from './FrankDropdownMenu';
import { FrankDropdownItem } from './FrankDropdownItem';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Dropdown/Base/FrankDropdownTrigger',
  component: FrankDropdownTrigger,
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
} satisfies Meta<typeof FrankDropdownTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'open menu',
  },
  render: args => (
    <FrankDropdown>
      <FrankDropdownTrigger {...args}>Open Menu</FrankDropdownTrigger>
      <FrankDropdownMenu>
        <FrankDropdownItem key="menu01">menu01</FrankDropdownItem>
      </FrankDropdownMenu>
    </FrankDropdown>
  ),
};
