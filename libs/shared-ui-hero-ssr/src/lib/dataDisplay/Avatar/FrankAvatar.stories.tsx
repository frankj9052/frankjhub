import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankAvatar } from './FrankAvatar';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Avatar/FrankAvatar',
  component: FrankAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customized Avatar component based on @heroui/react Avatar, allowing additional styling and configuration.',
      },
    },
    actions: {},
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: "The user's name used for displaying initials if no image is provided.",
    },
    src: {
      control: { type: 'text' },
      description: 'The URL of the avatar image.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the avatar: small, medium, or large.',
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether to disable avatar interactions like click or hover.',
    },
    isBordered: {
      control: { type: 'boolean' },
      description: 'Whether to show a border around the avatar.',
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: 'Border radius of the avatar (including full circle).',
    },
    className: {
      control: { type: 'text' },
      description: 'Custom class name for additional CSS styling.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithName: Story = {
  args: {
    name: 'Frank',
  },
};

export const WithImage: Story = {
  args: {
    name: 'Frank',
    src: 'https://img.0756bf.com/uploads/allimg/2021042109/uqaqhuvavt0.jpg',
  },
};
