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
        component: '...',
      },
    },
    actions: {},
  },
  argTypes: {},
  args: {
    onClick: index => {
      console.log(`Switch to ${index}`);
    },
  },
} satisfies Meta<typeof CarouselPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 6,
    currentIndex: 0,
  },
};
