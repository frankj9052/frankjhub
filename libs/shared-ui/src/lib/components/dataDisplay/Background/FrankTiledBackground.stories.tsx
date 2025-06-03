import type { Meta, StoryObj } from '@storybook/react';
import { FrankTiledBackground } from './FrankTiledBackground';

const meta = {
  title: 'Components/DataDisplay/Background/FrankTiledBackground',
  component: FrankTiledBackground,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A background container component that tiles a given image across the entire area.',
      },
    },
    actions: {},
  },
  argTypes: {
    imageUrl: {
      control: { type: 'text' },
      description: 'URL of the image to be used as a tiled background.',
    },
    className: {
      control: { type: 'text' },
      description: 'Custom class name for additional styling.',
    },
    children: {
      control: false,
      description: 'Child elements to render on top of the background.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankTiledBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="w-[1024px] h-[1080px]" />,
    imageUrl: 'https://svgsilh.com/png-1024/26432.png',
  },
};
