import type { Meta, StoryObj } from '@storybook/react';
import { CalendarViewSwitcher } from './CalendarViewSwitcher';

const meta = {
  title: 'Components/Navigation/Tabs/CalendarViewSwitcher',
  component: CalendarViewSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A three-option button group component used to switch between different calendar views, providing visual feedback on the currently selected view.',
      },
    },
    actions: {
      handles: ['handleClickLeftButton', 'handleClickMiddleButton', 'handleClickRightButton'],
    },
  },
  argTypes: {
    handleClickLeftButton: {
      action: 'handleClickLeftButton',
      description: 'Callback triggered when the left button is clicked.',
    },
    handleClickMiddleButton: {
      action: 'handleClickMiddleButton',
      description: 'Callback triggered when the middle button is clicked.',
    },
    handleClickRightButton: {
      action: 'handleClickRightButton',
      description: 'Callback triggered when the right button is clicked.',
    },
  },
  args: {},
} satisfies Meta<typeof CalendarViewSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
