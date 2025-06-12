import type { Meta, StoryObj } from '@storybook/react';
import { TimeGridDay } from './TimeGridDay';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankBigCalendarParts/TimeGridDay',
  component: TimeGridDay,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TimeGridDay is a day view calendar component that displays shifts grouped by doctor, featuring dynamic time scaling, current time indicators, and adjustable row heights for a responsive scheduling experience.',
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
    startHour: {
      control: { type: 'number' },
      description: 'Optional. Start hour of the calendar view (default is 9 AM).',
    },
    endHour: {
      control: { type: 'number' },
      description: 'Optional. End hour of the calendar view (default is 6 PM).',
    },
    intervalPerHour: {
      control: { type: 'number' },
      description: 'Optional. Number of rows per hour (default is 2; e.g., every 30 minutes).',
    },
    rowHeight: {
      control: { type: 'number' },
      description: 'Optional. Height of each time slot row in pixels (default is 25px).',
    },
    shiftsData: {
      control: false,
      description:
        'Optional. Array of shift data to render on the calendar, grouped by doctor and date.',
    },
  },
  args: {},
} satisfies Meta<typeof TimeGridDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 1066,
    height: 630,
    startHour: 0,
    endHour: 24,
  },
};
