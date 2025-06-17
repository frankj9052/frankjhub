import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankArrowSwitcher } from './FrankArrowSwitcher';

const meta = {
  title: 'Shared-UI-Core/Navigation/Tabs/FrankArrowSwitcher',
  component: FrankArrowSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankArrowSwitcher is a controllable component that renders two arrow buttons with default styles. You can control the disabled state of each button and define custom behaviors when each arrow is clicked.',
      },
    },
    actions: {
      handles: ['left arrow clicked', 'right arrow clicked'],
    },
  },

  args: {},
  argTypes: {
    leftArrowDisabled: {
      control: 'boolean',
      description: 'Whether the left arrow button is disabled.',
      defaultValue: false,
    },
    rightArrowDisabled: {
      control: 'boolean',
      description: 'Whether the right arrow button is disabled.',
      defaultValue: false,
    },
    handleLeftArrowClick: {
      action: 'left arrow clicked',
      description: 'Callback function triggered when the left arrow button is clicked.',
    },
    handleRightArrowClick: {
      action: 'right arrow clicked',
      description: 'Callback function triggered when the right arrow button is clicked.',
    },
  },
} satisfies Meta<typeof FrankArrowSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
