import type { Meta, StoryObj } from '@storybook/react';
import { FrankCarousel } from './FrankCarousel';

const meta = {
  title: 'Components/DataDisplay/Carousel/FrankCarousel',
  component: FrankCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible carousel component built on top of the Swiper library. Supports customization of slide behavior, appearance, autoplay, looping, and interaction events like active index changes.',
      },
    },
    actions: {
      handles: ['onActiveIndexChange'],
    },
  },
  argTypes: {
    children: {
      control: false,
      description: 'The content to render inside the carousel.',
    },
    childWidth: {
      control: { type: 'number' },
      description: 'The width of each child slide in pixels.',
    },
    endSpace: {
      control: { type: 'number' },
      description: 'The space in pixels to add at the end of the carousel.',
    },
    slidesPerView: {
      control: { type: 'number' },
      description: 'The number of slides visible per view.',
    },
    centeredSlides: {
      control: { type: 'boolean' },
      description: 'Whether to center the active slide.',
    },
    initialSlide: {
      control: { type: 'number' },
      description: 'The index of the initial slide to display.',
    },
    loop: {
      control: { type: 'boolean' },
      description: 'Whether to loop the slides infinitely.',
    },
    autoPlay: {
      control: { type: 'boolean' },
      description: 'Whether the slides should autoplay.',
    },
    activeIndex: {
      control: { type: 'number' },
      description: 'The current active slide index.',
    },
    onActiveIndexChange: {
      action: 'onActiveIndexChange',
      description: 'Callback function triggered when the active slide index changes.',
    },
    width: {
      control: { type: 'number' },
      description: 'The total width of the carousel in pixels.',
    },
    freeMode: {
      control: { type: 'boolean' },
      description: 'Whether to enable free scrolling without snapping to slides.',
    },
    slideToClickedSlide: {
      control: { type: 'boolean' },
      description: 'Whether clicking a slide moves it to the active position.',
    },
  },
  args: {},
  decorators: [
    (Story, context) => {
      return (
        <div className="w-[1440px] h-[500px] bg-gray-200 overflow-hidden">
          <Story
            args={{
              ...context.args,
            }}
          />
        </div>
      );
    },
  ],
} satisfies Meta<typeof FrankCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const FakeCard = ({ index }: { index: number }) => {
  return (
    <div className="bg-blue-200 w-[200px] h-[333px] border-1 border-[#000] aaml-[20px] flex cursor-pointer">
      <div className="flex flex-col items-center justify-center h-full bg-pink-200 flex-1">
        <div>{index}</div>
        <div>main</div>
        <div>content</div>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    childWidth: 200,
    spaceBetween: 10,
    endSpace: 20,
    freeMode: true,
    slidesPerView: 'auto',
    // autoPlay: true,
    // loop: true,
    children: Array.from({ length: 14 }).map((_, index) => <FakeCard key={index} index={index} />),
  },
};

export const NotFreeMode: Story = {
  args: {
    childWidth: 200,
    spaceBetween: 20,
    slidesPerView: 6,
    // autoPlay: true,
    // loop: true,
    children: Array.from({ length: 14 }).map((_, index) => <FakeCard key={index} index={index} />),
  },
};

// slidesPerView: 4,
// childWidth: 223,
// spaceBetween: 20,
// loop: true,
// autoPlay: true,
// width: 1440,
