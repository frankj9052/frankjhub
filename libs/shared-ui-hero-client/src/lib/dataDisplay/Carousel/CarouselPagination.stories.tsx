import type { Meta, StoryObj } from '@storybook/react-vite';
import { CarouselPagination } from './CarouselPagination';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Carousel/CarouselPagination',
  component: CarouselPagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'CarouselPagination renders a row of dots for navigating through a carousel. The current index is highlighted with a filled dot, and clicking on a dot triggers navigation.',
      },
    },
    actions: { argTypesRegex: '^on.*' }, // ✅ 修复 Type 错误
  },
  argTypes: {
    size: {
      description: 'Total number of dots/pages',
      control: { type: 'number', min: 1 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '5' },
      },
    },
    currentIndex: {
      description: 'Currently active dot index (0-based)',
      control: { type: 'number', min: 0 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onClick: {
      description: 'Callback when a dot is clicked',
      action: 'clicked',
      table: {
        type: { summary: '(index: number) => void' },
      },
    },
  },
  args: {
    size: 5,
    currentIndex: 0,
    onClick: index => {
      console.log(`Switch to ${index}`);
    },
  },
} satisfies Meta<typeof CarouselPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentIndex: 0,
  },
};

export const MiddleActive: Story = {
  args: {
    currentIndex: 2,
  },
};

export const LastActive: Story = {
  args: {
    currentIndex: 4,
  },
};

export const ManyDots: Story = {
  args: {
    size: 10,
    currentIndex: 5,
  },
};
