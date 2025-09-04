import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankButton } from './FrankButton';

const meta = {
  title: 'Shared-UI-Hero-SSR/General/Button/FrankButton',
  component: FrankButton,
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
  argTypes: {},
} satisfies Meta<typeof FrankButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'bordered',
    radius: 'sm',
    disableRipple: true,
    children: 'Click Me',
  },
};
