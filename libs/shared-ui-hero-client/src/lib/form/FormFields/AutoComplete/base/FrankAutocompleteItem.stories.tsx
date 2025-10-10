import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankAutocompleteItem } from './FrankAutocompleteItem';
import FrankAutocomplete from './FrankAutocomplete';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/AutoComplete/Base/FrankAutocompleteItem',
  component: FrankAutocompleteItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof FrankAutocompleteItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'item label',
  },
  render: args => (
    <FrankAutocomplete ariaLabel="test">
      <FrankAutocompleteItem {...args} />
    </FrankAutocomplete>
  ),
};
