import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankDropdownItem } from './FrankDropdownItem';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Dropdown/Base/FrankDropdownItem',
  component: FrankDropdownItem,
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
} satisfies Meta<typeof FrankDropdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'item test',
    key: 'test01',
    textValue: 'test01',
  },
};
