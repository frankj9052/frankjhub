import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeScale } from './TimeScale';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankBigCalendarParts/TimeScale',
  component: TimeScale,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TimeScale is a vertical timeline component displaying hourly labels, typically placed alongside a calendar grid to indicate time slots. Supports customizable start and end hours, and adjustable row heights.',
      },
    },
    actions: {},
  },
  argTypes: {
    startHour: {
      control: { type: 'number' },
      description: 'Starting hour of the time scale. Defaults to 0 (midnight).',
    },
    endHour: {
      control: { type: 'number' },
      description: 'Ending hour of the time scale. Defaults to 24 (midnight next day).',
    },
    rowHeight: {
      control: { type: 'number' },
      description: 'Height of each hourly row in pixels. Defaults to 25px.',
    },
  },
  args: {},
} satisfies Meta<typeof TimeScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // width: 1066,
    // height: 630,
    // startTime: '2023-08-01T13:00:00.000Z',
    // endTime: '2023-08-01T21:00:00.000Z',
  },
};
