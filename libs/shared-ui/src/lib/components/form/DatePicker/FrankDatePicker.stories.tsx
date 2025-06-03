import type { Meta, StoryObj } from '@storybook/react';
import { FrankDatePicker } from './FrankDatePicker';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

const meta = {
  title: 'Components/Form/DatePicker/FrankDatePicker',
  component: FrankDatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customized DatePicker component built on top of @heroui/react, offering styling customization, minimum and maximum date constraints, and configurable popover placement for the calendar dropdown.',
      },
    },
    actions: {
      handles: ['onChange'],
    },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the date picker in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the date picker in pixels.',
    },
    variant: {
      control: { type: 'select' },
      options: ['flat', 'faded', 'bordered', 'underlined'],
      description: 'Visual style variant of the input field.',
    },
    defaultValue: {
      control: false,
      description: 'Default selected date for uncontrolled usage.',
    },
    value: {
      control: false,
      description: 'Controlled selected date value.',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback triggered when the selected date changes.',
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: 'Border radius of the input field.',
    },
    endContent: {
      control: false,
      description: 'Custom content displayed at the end of the input field.',
    },
    minValue: {
      control: false,
      description: 'Minimum selectable date.',
    },
    maxValue: {
      control: false,
      description: 'Maximum selectable date.',
    },
    popoverPlacement: {
      control: { type: 'text' },
      description: 'Placement of the popover calendar relative to the input field.',
    },
  },
  args: {
    onChange: value => {
      console.log('value changed ===> ', value);
    },
  },
} satisfies Meta<typeof FrankDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 144,
    height: 32,
    variant: 'bordered',
    radius: 'sm',
    endContent: <MdOutlineKeyboardArrowDown size={20} />,
    popoverPlacement: 'bottom-start',
    // labelPlacement: 'outside',
    // label: <div className='font-inter font-[500] text-[14px] text-[#303030]'>Start Day</div>,
  },
};
