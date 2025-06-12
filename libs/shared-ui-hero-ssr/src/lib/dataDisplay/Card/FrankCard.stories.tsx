import type { Meta, StoryObj } from '@storybook/react';
import { FrankCard } from './FrankCard';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Card/FrankCard',
  component: FrankCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankCard is a customizable card component with optional cover, header, body, and footer sections, supporting interactivity like press, hover, and blur effects.',
      },
    },
    actions: {
      handles: ['onPress'],
    },
  },
  args: {},
  argTypes: {
    cardCover: {
      control: false,
      description: 'The cover content of the card, typically an image or overlay.',
    },
    cardBody: {
      control: false,
      description: 'The main body content of the card.',
    },
    cardHeader: {
      control: false,
      description: 'The header content displayed at the top of the card.',
    },
    cardFooter: {
      control: false,
      description: 'The footer content displayed at the bottom of the card.',
    },
    isBlurred: {
      control: 'boolean',
      description: 'Whether to apply a blur effect to the card background.',
    },
    isFooterBlurred: {
      control: 'boolean',
      description: 'Whether to apply a blur effect only to the card footer.',
    },
    key: {
      control: false,
      description:
        'Optional React key for list rendering (not typically controlled via Storybook).',
    },
    isPressable: {
      control: 'boolean',
      description: 'Whether the card is pressable (clickable).',
    },
    isHoverable: {
      control: 'boolean',
      description: 'Whether the card has hover interaction effects.',
    },
    shadow: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg', 'none'],
      },
      description: "Size of the card's shadow.",
    },
    onPress: {
      action: 'pressed',
      description: 'Callback function triggered when the card is pressed.',
    },
    cardWidth: {
      control: {
        type: 'number',
      },
      description: 'Width of the card in pixels.',
    },
    cardHeight: {
      control: {
        type: 'number',
      },
      description: 'Height of the card in pixels.',
    },
    className: {
      control: 'text',
      description: 'Additional custom CSS classes for the card.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the card interactions are disabled.',
    },
    disableAnimation: {
      control: 'boolean',
      description: 'Whether to disable card interaction animations.',
    },
    disableRipple: {
      control: 'boolean',
      description: 'Whether to disable the ripple effect on click.',
    },
    allowTextSelectionOnPress: {
      control: 'boolean',
      description: 'Whether to allow text selection while pressing the card.',
    },
  },
} satisfies Meta<typeof FrankCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cardCover: <div className="bg-red-200 w-[300px] h-[200px]">card cover</div>,
    cardBody: <div className="bg-yellow-100">card body</div>,
    cardHeader: <div className="bg-blue-200">card header</div>,
    cardFooter: <div className="bg-green-200">card footer</div>,
  },
};
