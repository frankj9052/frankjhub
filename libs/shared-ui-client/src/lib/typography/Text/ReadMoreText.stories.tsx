import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReadMoreText } from './ReadMoreText';

const meta = {
  title: 'Shared-UI-Client/Typography/Text/ReadMoreText',
  component: ReadMoreText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof ReadMoreText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'font-inter font-[450] text-[14px] leading-[20px] text-[#616161] w-[300px]',
  },
};
