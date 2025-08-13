import type { Meta, StoryObj } from '@storybook/react-vite';
import { CarouselNavigation } from './CarouselNavigation';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Carousel/CarouselNavigation',
  component: CarouselNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'CarouselNavigation is a responsive arrow button used for navigating carousels. It supports left and right directions and can be disabled.',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    direction: {
      description: 'The direction of the navigation arrow',
      control: { type: 'radio' },
      options: ['left', 'right'],
      table: {
        type: { summary: `'left' | 'right'` },
        defaultValue: { summary: 'left' },
      },
    },
    disabled: {
      description: 'Disables the navigation button and changes appearance',
      control: { type: 'boolean' },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler when the button is clicked',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  args: {
    onClick: () => {
      console.log('navigation clicked');
    },
  },
} satisfies Meta<typeof CarouselNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Left-facing navigation button */
export const Default: Story = {
  args: {
    direction: 'left',
    disabled: false,
  },
};

/** Right-facing navigation button */
export const Next: Story = {
  args: {
    direction: 'right',
    disabled: false,
  },
};

/** Disabled left navigation button */
export const DisabledLeft: Story = {
  args: {
    direction: 'left',
    disabled: true,
  },
};

/** Disabled right navigation button */
export const DisabledRight: Story = {
  args: {
    direction: 'right',
    disabled: true,
  },
};
