import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarShiftComponent } from './CalendarShiftComponent';
import { calendarSampleData } from './calendarSampleData';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankBigCalendarParts/CalendarShiftComponent',
  component: CalendarShiftComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          "CalendarShiftComponent displays a doctor's shift block within a calendar grid, dynamically rendering bookings with adjustable positioning, background colors, and status indicators.",
      },
    },
    actions: {},
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Optional. Width of the shift block in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Optional. Height of the shift block in pixels.',
    },
    shift: {
      control: false,
      description: 'Required. Shift data including bookings and visual properties.',
    },
    rowHeight: {
      control: { type: 'number' },
      description: 'Required. Height of a single row (time slot) in pixels.',
    },
    intervalPerHour: {
      control: { type: 'number' },
      description: 'Required. Number of intervals per hour (e.g., 2 means 30-minute slots).',
    },
  },
  args: {
    rowHeight: 25,
    intervalPerHour: 2,
  },
} satisfies Meta<typeof CalendarShiftComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 300,
    height: 400,
    shift: calendarSampleData.shiftData_provider01,
  },
};

export const NoBookingSlot: Story = {
  args: {
    width: 300,
    height: 200,
    shift: calendarSampleData.shiftData_provider02_01,
  },
};
