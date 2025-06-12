import type { Meta, StoryObj } from '@storybook/react';
import { FrankFullCalendar } from './FrankFullCalendar';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Calendar/FrankFullCalendar',
  component: FrankFullCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customized FullCalendar component wrapper with added header controls for date navigation, view switching, and styling integration using FullCalendar plugins.',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the calendar container in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the calendar container in pixels.',
    },
    currentView: {
      control: { type: 'select' },
      options: ['timeGridWeek', 'timeGridDay', 'listDay'],
      description: "Current active view type ('timeGridWeek', 'timeGridDay', or 'listDay').",
    },
    onCurrentViewChange: {
      action: 'onCurrentViewChange',
      description: 'Callback triggered when the calendar view changes.',
    },
    focusedDate: {
      control: { type: 'date' },
      description: 'Current focused date displayed in the calendar.',
    },
    onFocusedDateChange: {
      action: 'onFocusedDateChange',
      description: 'Callback triggered when the focused date changes.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankFullCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 1098,
    height: 714,
  },
};
