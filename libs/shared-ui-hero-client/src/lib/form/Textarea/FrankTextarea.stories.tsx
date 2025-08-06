import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankTextArea } from './FrankTextarea';

const meta: Meta<typeof FrankTextArea> = {
  title: 'Shared-UI-Hero-Client/Form/Textarea/FrankTextArea',
  component: FrankTextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankTextArea is a textarea component built on top of @heroui/react. It supports controlled and uncontrolled usage, custom labels, placeholders, read-only and disabled states, validation states, row limits, and styling customizations.',
      },
    },
    actions: {
      handles: ['onValueChange', 'onBlur', 'onClear'],
    },
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Visible label displayed above or inside the textarea.',
    },
    ariaLabel: {
      control: { type: 'text' },
      description: 'ARIA label for accessibility if the label is not visible.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Text shown when textarea is empty.',
    },
    defaultValue: {
      control: { type: 'text' },
      description: 'Initial value for the textarea (uncontrolled mode).',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled value for the textarea.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback fired when the textarea value changes.',
    },
    onBlur: {
      action: 'onBlur',
      description: 'Callback fired when the textarea loses focus.',
    },
    onClear: {
      action: 'onClear',
      description: 'Callback fired when clear button is clicked (if enabled).',
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is disabled.',
    },
    isReadOnly: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is read-only.',
    },
    isRequired: {
      control: { type: 'boolean' },
      description: 'Whether the textarea is required.',
    },
    isClearable: {
      control: { type: 'boolean' },
      description: 'Whether to show a clear button.',
    },
    isInvalid: {
      control: { type: 'boolean' },
      description: 'Marks the textarea as having an error.',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message to display when isInvalid is true.',
    },
    description: {
      control: { type: 'text' },
      description: 'Additional description shown below the textarea.',
    },
    labelPlacement: {
      control: { type: 'radio' },
      options: ['outside', 'outside-left', 'inside'],
      description: 'Position of the label.',
    },
    variant: {
      control: { type: 'radio' },
      options: ['flat', 'faded', 'bordered', 'underlined'],
      description: 'Visual variant of the textarea.',
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea.',
    },
    minRows: {
      control: { type: 'number' },
      description: 'Minimum number of visible rows.',
    },
    maxRows: {
      control: { type: 'number' },
      description: 'Maximum number of visible rows.',
    },
    disableAnimation: {
      control: { type: 'boolean' },
      description: 'Whether to disable the animation.',
    },
    disableAutosize: {
      control: { type: 'boolean' },
      description: 'Whether to disable automatic resizing of the textarea.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the component in pixels.',
    },
    radius: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: 'Corner radius size of the textarea.',
    },
    className: {
      control: false,
      description: 'Custom class name for the root component.',
    },
    classNames: {
      control: false,
      description: 'Custom classNames object for styling overrides.',
    },
    key: {
      control: false,
      description: 'React key (internal use).',
    },
  },
  args: {
    label: 'Message',
    placeholder: 'Type your message...',
    defaultValue: '',
    size: 'md',
    width: 400,
    variant: 'bordered',
    isClearable: true,
    minRows: 3,
    maxRows: 6,
  },
};

export default meta;
type Story = StoryObj<typeof FrankTextArea>;

export const Default: Story = {
  args: {},
};
