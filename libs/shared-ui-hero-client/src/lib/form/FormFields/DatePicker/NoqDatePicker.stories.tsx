import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoqDatePicker } from './NoqDatePicker';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/DatePicker/NoqDatePicker',
  component: NoqDatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customized date picker component that allows both manual text input (year, month, day) and popover calendar selection, supporting validation, range highlighting, and flexible date constraints.',
      },
    },
    actions: {
      handles: ['onValueChange'],
    },
  },

  args: {
    width: 144,
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the date picker in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the date picker in pixels.',
    },
    endContent: {
      control: false,
      description: 'Custom content to display at the end of the input field, such as an icon.',
    },
    value: {
      control: false,
      description: 'Controlled selected date value.',
    },
    onValueChange: {
      action: 'onValueChange',
      description: 'Callback triggered when the selected date changes.',
    },
    isStartDateSelection: {
      control: { type: 'boolean' },
      description:
        'Indicates whether the date picker is used for selecting a start date, affecting shortcut behaviors.',
    },
    zIndex: {
      control: { type: 'number' },
      description: 'z-index of the popover calendar for layering control.',
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
      description: 'Start of the highlighted date range.',
    },
    rangeEnd: {
      control: false,
      description: 'End of the highlighted date range.',
    },
  },
} satisfies Meta<typeof NoqDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  decorators: [
    Story => {
      return (
        <div className="w-[500px] h-[500px] bg-gray-300 px-3 py-3">
          <Story />
        </div>
      );
    },
  ],
};
