import type { Meta, StoryObj } from '@storybook/react';
import FrankButtonBase from './FrankButtonBase';
import { FaArrowAltCircleRight } from 'react-icons/fa';
import { IoArrowDown } from 'react-icons/io5';
import { motion } from 'framer-motion';

const meta = {
  title: 'Shared-UI-Hero-SSR/General/Button/FrankButtonBase',
  component: FrankButtonBase,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable button component based on @heroui/react Button, with support for custom content, size, and background color.',
      },
    },
    actions: {},
  },

  args: {
    onPress: () => {
      console.log('click');
    },
  },
  argTypes: {
    customizeContent: {
      control: false,
      description: 'Custom content to render inside the button.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the button container in pixels.',
    },
    height: {
      control: { type: 'number' },
      description: 'Height of the button container in pixels.',
    },
    backgroundColor: {
      control: { type: 'text' },
      description: 'Background color of the button.',
    },
  },
} satisfies Meta<typeof FrankButtonBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    customizeContent: (
      <p className="font-[550] font-inter text-[#303030] text-[12px]">Apply to all</p>
    ),
    variant: 'bordered',
    radius: 'sm',
    disableRipple: true,
  },
  decorators: [
    Story => {
      return (
        <div className="w-[83px] h-[26px]">
          <Story />
        </div>
      );
    },
  ],
};

const ButtonContent = () => {
  return (
    <div className="flex text-white items-center justify-center gap-2">
      <span>Contact Me</span>
      <span>
        <FaArrowAltCircleRight />
      </span>
    </div>
  );
};

export const ContactMeInPortfolio: Story = {
  args: {
    variant: 'solid',
    backgroundColor: 'green',
    customizeContent: <ButtonContent />,
    radius: 'sm',
  },
  decorators: [
    Story => {
      return (
        <div className="w-[196px] h-[65px]">
          <Story />
        </div>
      );
    },
  ],
};

export const ScrollDownButton: Story = {
  args: {
    variant: 'light',
    disableRipple: true,
    radius: 'sm',
    customizeContent: (
      <div className="text-[#0E2431] font-[500] font-popins px-2 py-1 flex gap-2 items-center">
        <span>Scroll Down</span>
        <motion.span
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IoArrowDown size={20} />
        </motion.span>
      </div>
    ),
  },
};
