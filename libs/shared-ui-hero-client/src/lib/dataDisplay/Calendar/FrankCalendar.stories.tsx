import type { Meta, StoryObj } from '@storybook/react';
import { FrankCalendar } from './FrankCalendar';
// import { CalendarDate, parseDate } from '@internationalized/date';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankCalendar',
  component: FrankCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable calendar component that supports date selection, optional range highlighting, and quick shortcut buttons for faster selection.',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },

  args: {},
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['Small', 'Default', 'WithShortcut'],
      description: "Visual variant of the calendar. Defaults to 'Default'.",
    },
    isStartDateSelection: {
      control: { type: 'boolean' },
      description: 'Whether the calendar is for selecting a start date (affects shortcut options).',
    },
    value: {
      control: false,
      description: 'Currently selected date value.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback triggered when a date is selected.',
    },
    focusedValue: {
      control: false,
      description: 'Date currently focused (centered) in the calendar view.',
    },
    onFocusedValueChange: {
      action: 'onFocusedValueChange',
      description: 'Callback triggered when the focused date changes.',
    },
    minValue: {
      control: false,
      description: 'Minimum selectable date.',
    },
    maxValue: {
      control: false,
      description: 'Maximum selectable date.',
    },
    rangeStart: {
      control: false,
      description: 'Start of the selected date range (for range highlighting).',
    },
    rangeEnd: {
      control: false,
      description: 'End of the selected date range (for range highlighting).',
    },
  },
} satisfies Meta<typeof FrankCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'WithShortcut',
    // minValue: parseDate('2025-03-07')
    // maxValue: parseDate('2025-03-28')
    // rangeStart: parseDate('2025-03-07'),
    // rangeEnd: parseDate('2025-03-28')
  },
  decorators: [
    Story => {
      return (
        <div className="w-[500px] h-[500px] bg-gray-300 flex items-center justify-center">
          <Story />
        </div>
      );
    },
  ],
};
