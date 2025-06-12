import type { Meta, StoryObj } from '@storybook/react';
import FrankPopover from './FrankPopover';
import { FrankButtonBase } from '@frankjhub/shared-ui-hero-ssr';

const meta = {
  title: 'Shared-UI-Hero-Client/Feedback/Popover/FrankPopover',
  component: FrankPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable popover component built on @heroui/react, supporting controlled or uncontrolled open state, flexible placement options, styling customizations like shadow and border radius, and optional arrow display.',
      },
    },
    actions: {
      handles: ['onOpenChange'],
    },
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end',
      ],
      description: 'Placement of the popover relative to the trigger element.',
    },
    popoverTrigger: {
      control: false,
      description: 'The element that triggers the popover when clicked or hovered.',
    },
    popoverContent: {
      control: false,
      description: 'The content displayed inside the popover.',
    },
    showArrow: {
      control: { type: 'boolean' },
      description: 'Whether to display an arrow pointing to the trigger element.',
    },
    shadow: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none'],
      description: "Size of the shadow around the popover. Defaults to 'md'.",
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: "Border radius of the popover. Defaults to 'md'.",
    },
    isOpen: {
      control: { type: 'boolean' },
      description: 'Controlled open state of the popover.',
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: "Callback triggered when the popover's open state changes.",
    },
  },
  args: {},
} satisfies Meta<typeof FrankPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placement: 'bottom',
    popoverTrigger: <FrankButtonBase customizeContent="test trigger" width={83} height={26} />,
    popoverContent: <div>test</div>,
  },
};
