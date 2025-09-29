import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankSelect } from './FrankSelect';

const meta: Meta<typeof FrankSelect> = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/Select/FrankSelect',
  component: FrankSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankSelect is a select dropdown component built on top of @heroui/react. It supports single or multiple selection, controlled or uncontrolled usage, and can be customized via props like label, placeholder, selection mode, size, and width.',
      },
    },
    actions: {
      handles: ['onSelectionChange'],
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Visible label displayed above the select field.',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for accessibility if the label is not visible.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Text shown when no item is selected.',
    },
    selectionMode: {
      control: { type: 'radio' },
      options: ['single', 'multiple'],
      description: "Selection mode: 'single' (default) or 'multiple'.",
    },
    selectedKeys: {
      control: 'object',
      description: 'Array of currently selected keys (for controlled mode).',
    },
    items: {
      control: false,
      description: 'List of selectable items.',
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the select component.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the select component in pixels.',
    },
    onSelectionChange: {
      action: 'onSelectionChange',
      description: 'Callback fired when selection changes.',
    },
    variant: {
      control: { type: 'radio' },
      options: ['flat', 'faded', 'bordered', 'underlined'],
      description: 'Visual variant of the textarea.',
    },
  },
  args: {
    label: 'Select a person',
    placeholder: 'Choose one',
    selectionMode: 'single',
    size: 'md',
    width: 300,
    items: [
      { key: '01', label: 'Frank' },
      { key: '02', label: 'Lu' },
      { key: '03', label: 'Rohan' },
      { key: '04', label: 'Leo' },
      { key: '05', label: 'Keith' },
      { key: '06', label: 'Sophia' },
      { key: '07', label: 'Jackson' },
      { key: '08', label: 'Emily' },
      { key: '09', label: 'Ethan' },
      { key: '10', label: 'Olivia' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof FrankSelect>;

export const Default: Story = {
  args: {},
};
