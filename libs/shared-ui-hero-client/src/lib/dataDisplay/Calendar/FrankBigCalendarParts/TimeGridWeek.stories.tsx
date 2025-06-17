import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeGridWeek } from './TimeGridWeek';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankBigCalendarParts/TimeGridWeek',
  component: TimeGridWeek,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TimeGridWeek is a week view calendar component that displays shifts grouped by date and doctor, supporting dynamic time scaling, multi-column layouts, current time indicators, and responsive grid sizing for efficient weekly scheduling.',
      },
    },
    actions: {},
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Optional. Width of the calendar container in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Optional. Height of the calendar container in pixels.',
    },
    shiftsData: {
      control: false,
      description: 'Optional. Array of shift data to render across the week view.',
    },
    focusedDate: {
      control: { type: 'date' },
      description: 'Optional. The date from which the displayed week starts (default is today).',
    },
    startHour: {
      control: { type: 'number' },
      description: 'Optional. Start hour of the calendar view (default is 9 AM).',
    },
    endHour: {
      control: { type: 'number' },
      description: 'Optional. End hour of the calendar view (default is 6 PM).',
    },
    rowHeight: {
      control: { type: 'number' },
      description: 'Optional. Height of each time slot row in pixels (default is 25px).',
    },
    intervalPerHour: {
      control: { type: 'number' },
      description: 'Optional. Number of rows per hour (default is 2; e.g., every 30 minutes).',
    },
  },
  args: {},
} satisfies Meta<typeof TimeGridWeek>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 1098,
    height: 714,
  },
};
