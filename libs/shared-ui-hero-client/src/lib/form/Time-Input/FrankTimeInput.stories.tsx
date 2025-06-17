import type { Meta, StoryObj } from '@storybook/react-vite';
import FrankTimeInput from './FrankTimeInput';
import { useState } from 'react';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Time-Input/FrankTimeInput',
  component: FrankTimeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankTimeInput is a customizable time input component built on top of @heroui/react TimeInput, supporting 24-hour format, adjustable dimensions, font size customization, validation states, and accessibility labeling.',
      },
    },
    actions: {
      handles: ['time value changed'],
    },
  },
  argTypes: {
    width: {
      control: 'number',
      description: 'Optional. Width of the time input container in pixels.',
    },
    height: {
      control: 'number',
      description: 'Optional. Height of the time input container in pixels.',
    },
    value: {
      control: false,
      description: 'Optional. Controlled selected time in "HH:mm" format.',
    },
    minValue: {
      control: 'text',
      description: 'Optional. Minimum selectable time in "HH:mm" format.',
    },
    setValue: {
      action: 'time value changed',
      description: 'Callback triggered when the selected time changes.',
    },
    ariaLabel: {
      control: 'text',
      description: 'ARIA label for accessibility purposes.',
    },
    fontSize: {
      control: 'number',
      description: 'Optional. Font size for the time text.',
      defaultValue: 13,
    },
    errorMessage: {
      control: 'text',
      description: 'Optional. Error message to display if the input is invalid.',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Optional. Whether the time input is in an invalid state.',
    },
  },
  args: {
    width: 60,
    height: 32,
    // value: null,
    // setValue: (value) => { console.log("value check in args ===> ", value) },
    ariaLabel: 'test time input',
  },
} satisfies Meta<typeof FrankTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    (Story, context) => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Story
          args={{
            ...context.args,
            value,
            setValue: value => {
              if (value) {
                setValue(value.toString());
              }
            },
          }}
        />
      );
    },
  ],
};

export const WithError: Story = {
  args: {
    minValue: '11:30',
    errorMessage: 'Invalid time!',
    isInvalid: true,
  },
};
