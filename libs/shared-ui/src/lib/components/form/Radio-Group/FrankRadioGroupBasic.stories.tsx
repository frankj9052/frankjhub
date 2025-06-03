import type { Meta, StoryObj } from '@storybook/react';
import FrankRadioGroupBasic from './FrankRadioGroupBasic';

const meta = {
  title: 'Components/Form/Radio-Group/FrankRadioGroupBasic',
  component: FrankRadioGroupBasic,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A basic radio group component built on top of @heroui/react, supporting customizable layout orientation, radio sizes, colors, controlled or uncontrolled selection, and adjustable spacing between buttons.',
      },
    },
    actions: {
      handles: ['onValueChange'],
    },
  },
  argTypes: {
    defaultValue: {
      control: { type: 'text' },
      description: 'Default selected value of the radio group.',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: "Layout orientation of the radio buttons. Defaults to 'vertical'.",
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether the entire radio group is disabled. Defaults to false.',
    },
    radioData: {
      control: false,
      description: 'Array of radio button data (value and label).',
    },
    radioColor: {
      control: { type: 'color' },
      description: 'Custom color for the selected radio indicator.',
    },
    radioSize: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description: "Size of the radio button. Defaults to 'sm'.",
    },
    value: {
      control: { type: 'text' },
      description: 'Controlled selected value.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback triggered when the selected radio value changes.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the radio group in pixels.',
    },
    gap: {
      control: { type: 'number' },
      description: 'Gap between radio buttons. Defaults to 0.',
    },
  },
  args: {
    onValueChange: value => {
      console.log('value changed ===> ', value);
    },
  },
} satisfies Meta<typeof FrankRadioGroupBasic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: '03',
    radioData: [
      {
        value: '01',
        label: 'Frank',
      },
      {
        value: '02',
        label: 'Lu',
      },
      {
        value: '03',
        label: 'Rohan',
      },
      {
        value: '04',
        label: 'Leo',
      },
      {
        value: '05',
        label: 'Keith',
      },
    ],
  },
  decorators: [
    (Story, context) => {
      return (
        <div className="">
          <Story
            args={{
              ...context.args,
            }}
          />
        </div>
      );
    },
  ],
};
