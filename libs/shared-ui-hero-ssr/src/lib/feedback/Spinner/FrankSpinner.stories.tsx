import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankSpinner } from './FrankSpinner';

const meta = {
  title: 'Shared-UI-Hero-SSR/Feedback/Spinner/FrankSpinner',
  component: FrankSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A wrapper around @heroui/react Spinner, offering extended customization for size, color, label, label color, animation style, and additional styling through CSS classes.',
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the spinner.',
    },
    color: {
      control: { type: 'select' },
      options: [
        'current',
        'white',
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
      ],
      description: "Color of the spinner. Defaults to 'current'.",
    },
    label: {
      control: { type: 'text' },
      description: 'Label text displayed next to or below the spinner.',
    },
    labelColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'foreground'],
      description: 'Color of the label text.',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'gradient', 'wave', 'dots', 'spinner', 'simple'],
      description: "Animation style of the spinner. Defaults to 'default'.",
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes for custom styling.',
    },
  },
} satisfies Meta<typeof FrankSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'sm',
    color: 'current',
    variant: 'default',
  },
};
