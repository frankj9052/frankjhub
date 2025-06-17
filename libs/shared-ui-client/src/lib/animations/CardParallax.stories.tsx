import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardParallax } from './CardParallax';
import { MotionValue } from 'framer-motion';

const meta = {
  title: 'Shared-UI-Client/Aminations/CardParallax',
  component: CardParallax,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that creates a parallax effect by scaling and positioning its children based on the scroll position. Requires `framer-motion` and `lenis` libraries.',
      },
    },
    actions: {},
  },
  argTypes: {
    children: {
      control: false,
      description:
        'The children to render inside the parallax. Include `imageScale: MotionValue<number>` in props if scaling is required for images.',
    },
    cardHeader: {
      control: { type: 'text' },
      description: 'The header of the parallax.',
    },
    isScaled: {
      control: { type: 'boolean' },
      description: 'Whether the children should be scaled.',
    },
    gap: {
      control: { type: 'number' },
      description: 'The gap between each child.',
    },
    startPoint: {
      control: { type: 'number' },
      description: 'The starting point of the parallax effect in screen view.',
    },
    backgroundImage: {
      control: { type: 'text' },
      description: 'The background image of the parallax effect.',
    },
  },

  args: {},
  decorators: [
    Story => (
      <div>
        <div className="w-full h-screen bg-pink-200" />
        <div className="w-full h-screen bg-yellow-200" />
        <div className="w-full bg-blue-200 flex items-center flex-col justify-center">
          <div className="w-[100px] h-[200px] bg-green-200" />
          <Story />
        </div>
        <div className="w-full h-screen bg-yellow-200" />
        <div className="w-full h-screen bg-pink-200" />
      </div>
    ),
  ],
} satisfies Meta<typeof CardParallax>;

export default meta;
type Story = StoryObj<typeof meta>;

type CardProps = {
  text: string;
  color: string;
  imageScale?: MotionValue<number>;
};
const Card = ({ text, color, imageScale }: CardProps) => {
  return (
    <div
      className="w-[600px] h-[300px] flex items-center justify-center rounded-xl"
      style={{
        backgroundColor: color,
      }}
    >
      {text}
      {imageScale && imageScale.get()}
    </div>
  );
};

const color = ['#BBACAF', '#977F6D', '#C2491D', '#B62429', '#88A28D'];

export const Default: Story = {
  args: {
    isScaled: true,
    gap: 60,
    // startPoint: 25,
    backgroundImage: {
      width: 1502,
      height: 962,
      alt: 'bg',
      src: 'https://static.vecteezy.com/system/resources/previews/001/971/264/non_2x/beautiful-cherry-blossom-with-bokeh-lights-background-concept-free-vector.jpg',
    },
    children: color.map((color, index) => {
      return <Card text={`Card ${index}`} color={color} />;
    }),
  },
};
