import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankAutocompleteSection } from './FrankAutocompleteSection';
import { FrankAutocompleteItem } from './FrankAutocompleteItem';
import FrankAutocomplete from './FrankAutocomplete';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/AutoComplete/Base/FrankAutocompleteSection',
  component: FrankAutocompleteSection,
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
} satisfies Meta<typeof FrankAutocompleteSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <FrankAutocompleteItem>item label</FrankAutocompleteItem>,
  },
  render: args => (
    <FrankAutocomplete ariaLabel="test">
      <FrankAutocompleteSection {...args} />
      <FrankAutocompleteItem>item label2</FrankAutocompleteItem>
    </FrankAutocomplete>
  ),
};
