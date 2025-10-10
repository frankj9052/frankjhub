import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankAutocompleteGeneral } from './FrankAutocompleteGeneral';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/AutoComplete/FrankAutocompleteGeneral',
  component: FrankAutocompleteGeneral,
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
} satisfies Meta<typeof FrankAutocompleteGeneral>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'test',
    defaultItems: [
      {
        label: '1',
        key: '1',
      },
      {
        label: '2',
        key: '2',
      },
      {
        label: '3',
        key: '3',
      },
    ],
  },
};
