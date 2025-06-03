import type { Meta, StoryObj } from '@storybook/react';
import { FrankBigCalendar } from './FrankBigCalendar';
import { calendarSampleData } from './FrankBigCalendarParts/calendarSampleData';

const meta = {
  title: 'Components/DataDisplay/Calendar/FrankBigCalendar',
  component: FrankBigCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully-featured calendar component that supports multiple views (week grid, day grid, list day), with built-in navigation, date control, and drag-and-drop capabilities.',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the calendar in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the calendar in pixels.',
    },
    currentView: {
      control: { type: 'select' },
      options: ['timeGridWeek', 'timeGridDay', 'listDay'],
      description: "Current active view type ('timeGridWeek', 'timeGridDay', or 'listDay').",
    },
    onCurrentViewChange: {
      action: 'onCurrentViewChange',
      description: 'Callback triggered when the view type changes.',
    },
    focusedDate: {
      control: { type: 'date' },
      description: 'Current focused date displayed in the calendar.',
    },
    onFocusedDateChange: {
      action: 'onFocusedDateChange',
      description: 'Callback triggered when the focused date changes.',
    },
    shiftsData: {
      control: false,
      description: 'Shift and booking data to populate the calendar.',
    },
    bookingEventActions: {
      control: false,
      description: 'Actions available for bookings in the list view (edit, cancel, etc.).',
    },
  },
  args: {},
} satisfies Meta<typeof FrankBigCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 1098,
    height: 714,
    shiftsData: calendarSampleData.shiftDataAll,
  },
};
