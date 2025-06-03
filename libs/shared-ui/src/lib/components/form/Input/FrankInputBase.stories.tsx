import type { Meta, StoryObj } from '@storybook/react';
import { FrankInputBase } from './FrankInputBase';

const meta = {
  title: 'Components/Form/Input/FrankInputBase',
  component: FrankInputBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled input component based on @heroui/react Input, offering customizable dimensions, validation states, label positioning, and the ability to add content inside or next to the input.',
      },
    },
    actions: {
      handles: ['onValueChange'],
    },
  },
  argTypes: {
    isRequired: {
      control: { type: 'boolean' },
      description: 'Whether the input field is required.',
    },
    label: {
      control: false,
      description: 'Label content for the input field.',
    },
    labelPlacement: {
      control: { type: 'select' },
      options: ['outside', 'outside-left', 'inside'],
      description: 'Placement of the label relative to the input field.',
    },
    name: {
      control: { type: 'text' },
      description: 'Name attribute of the input field.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text displayed inside the input field.',
    },
    type: {
      control: { type: 'text' },
      description: "Type attribute of the input field (e.g., 'text', 'email', 'password').",
    },
    variant: {
      control: { type: 'select' },
      options: ['flat', 'faded', 'bordered', 'underlined'],
      description: 'Visual style variant of the input field.',
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: "Border radius of the input field. Defaults to 'sm'.",
    },
    isInvalid: {
      control: { type: 'boolean' },
      description: 'Whether the input is in an invalid state.',
    },
    errorMessage: {
      control: { type: 'text' },
      description: 'Error message displayed when the input is invalid.',
    },
    endContent: {
      control: false,
      description: 'Custom content displayed at the end of the input field.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the input field in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the input field in pixels.',
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled value of the input field.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback triggered when the input value changes.',
    },
  },
  args: {
    onValueChange: value => {
      console.log('Value changed to: ', value);
    },
  },
} satisfies Meta<typeof FrankInputBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: ' ',
    labelPlacement: 'outside',
    label: (
      <div className="font-inter font-[500] text-[13px] text-[#303030]">
        Unit <span className="font-[400] text-[#616161]">(Optional)</span>
      </div>
    ),
    variant: 'bordered',
    height: 32,
    width: 138,
  },
};

export const RoomInput: Story = {
  args: {
    placeholder: ' ',
    labelPlacement: 'outside',
    label: (
      <div className="font-inter font-[500] text-[13px] text-[#303030]">
        Room <span className="font-[400] text-[#616161]">(Optional)</span>
      </div>
    ),
    variant: 'bordered',
    height: 32,
    width: 138,
  },
};

export const LocationLabelInput: Story = {
  args: {
    placeholder: ' ',
    labelPlacement: 'outside',
    label: (
      <div className="font-inter font-[500] text-[13px] text-[#303030]">
        Location Label <span className="font-[400] text-[#616161]">(Optional)</span>
      </div>
    ),
    variant: 'bordered',
    height: 32,
    width: 288,
  },
};
