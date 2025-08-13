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
        component: '...',
      },
    },
    actions: {},
  },
  argTypes: {},
  args: {
    onClick: () => {
      console.log('navigation clicked');
    },
  },
} satisfies Meta<typeof CarouselNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: 'left',
    disabled: false,
  },
};

export const Next: Story = {
  args: {
    direction: 'right',
    disabled: false,
  },
};
