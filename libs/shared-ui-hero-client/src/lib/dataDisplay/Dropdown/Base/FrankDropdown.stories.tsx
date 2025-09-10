import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankDropdown } from './FrankDropdown';
import { FrankDropdownTrigger } from './FrankDropdownTrigger';
import { FrankDropdownMenu } from './FrankDropdownMenu';
import { FrankDropdownItem } from './FrankDropdownItem';
import { FrankButton } from '@frankjhub/shared-ui-hero-ssr';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Dropdown/Base/FrankDropdown',
  component: FrankDropdown,
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
} satisfies Meta<typeof FrankDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [],
  },
  render: args => (
    <FrankDropdown {...args}>
      <FrankDropdownTrigger>
        <FrankButton>OPEN MENU!</FrankButton>
      </FrankDropdownTrigger>
      <FrankDropdownMenu>
        <FrankDropdownItem key="menu01">menu01</FrankDropdownItem>
      </FrankDropdownMenu>
    </FrankDropdown>
  ),
};
