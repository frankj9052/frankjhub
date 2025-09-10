import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankDropdownMenu } from './FrankDropdownMenu';
import { FrankDropdownItem } from './FrankDropdownItem';
import { FrankDropdownTrigger } from './FrankDropdownTrigger';
import { FrankDropdown } from './FrankDropdown';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Dropdown/Base/FrankDropdownMenu',
  component: FrankDropdownMenu,
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
} satisfies Meta<typeof FrankDropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <FrankDropdownItem key="testKey">Test Item</FrankDropdownItem>,
  },
  render: args => (
    <FrankDropdown>
      <FrankDropdownTrigger>Open Menu</FrankDropdownTrigger>
      <FrankDropdownMenu {...args}>
        <FrankDropdownItem key="menu01">menu01</FrankDropdownItem>
      </FrankDropdownMenu>
    </FrankDropdown>
  ),
};
