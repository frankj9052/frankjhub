import type { Meta, StoryObj } from '@storybook/react';
import { FrankTabs } from './FrankTabs';

const meta = {
  title: 'Shared-UI-Hero-Client/Navigation/Tabs/FrankTabs',
  component: FrankTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankTabs is a customizable tabs component built on top of @heroui/react Tabs. It supports controlled and uncontrolled modes, various layout options, color themes, size variations, and visual styles to fit different design needs.',
      },
    },
    actions: {
      handles: ['selection changed'],
    },
  },
  argTypes: {
    ariaLable: {
      control: 'text',
      description: 'ARIA lable for accessibility.',
    },
    tabsData: {
      control: false,
      description: 'Array of tabs, each containing a key, title, and content.',
    },
    radius: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'none', 'full'],
      },
      description: 'Optional. Border radius of the tabs.',
    },
    color: {
      control: {
        type: 'select',
        options: ['primary', 'default', 'secondary', 'success', 'warning', 'danger'],
      },
      description: 'Optional. Color theme of the tabs.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Optional. Whether all tabs are disabled.',
    },
    disabledKeys: {
      control: false,
      description: 'Optional. Keys of specific tabs to disable.',
    },
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
      description: 'Optional. Size of the tabs.',
    },
    variant: {
      control: {
        type: 'select',
        options: ['solid', 'light', 'underlined', 'bordered'],
      },
      description: 'Optional. Visual style variant of the tabs.',
    },
    selected: {
      control: false,
      description: 'Optional. Controlled selected tab key.',
    },
    onSelectionChange: {
      action: 'selection changed',
      description: 'Callback triggered when the selected tab changes.',
    },
    placement: {
      control: {
        type: 'select',
        options: ['top', 'bottom', 'start', 'end'],
      },
      description: 'Optional. Placement of the tabs relative to the content.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLable: 'options',
    tabsData: [
      {
        key: 'photos',
        title: 'photos',
        content: <div>Photos</div>,
      },
      {
        key: 'music',
        title: 'music',
        content: <div>Music</div>,
      },
      {
        key: 'vidios',
        title: 'vidios',
        content: <div>vidios</div>,
      },
    ],
  },
};
