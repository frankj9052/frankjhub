import type { Meta, StoryObj } from '@storybook/react';
import { CalendarGrid } from './CalendarGrid';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankBigCalendarParts/CalendarGrid',
  component: CalendarGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'CalendarGrid is a flexible grid component designed for calendar layouts. It supports customizable rows and columns based on time intervals and view type (such as day or week view). An imperative handle is exposed to allow parent components to retrieve the grid’s dimensions.',
      },
    },
    actions: {},
  },
  argTypes: {
    width: {
      control: 'number',
      description: 'Optional. Width of the calendar grid in pixels.',
    },
    startHour: {
      control: 'number',
      description: 'Optional. Start hour for the grid rows (default is 0).',
      defaultValue: 0,
    },
    endHour: {
      control: 'number',
      description: 'Optional. End hour for the grid rows (default is 24).',
      defaultValue: 24,
    },
    intervalPerHour: {
      control: 'number',
      description: 'Optional. Number of intervals per hour (default is 2; e.g., 30-minute slots).',
      defaultValue: 2,
    },
    columnCount: {
      control: 'number',
      description:
        'Required. Number of columns in the grid (1 for day view, 7 for week view, etc.).',
    },
  },
  args: {},
} satisfies Meta<typeof CalendarGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columnCount: 7,
    width: 515 * 2,
    startHour: 9,
    endHour: 18,
  },
};
