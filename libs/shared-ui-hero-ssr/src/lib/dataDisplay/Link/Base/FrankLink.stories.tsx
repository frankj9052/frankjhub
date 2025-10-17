import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankLink } from './FrankLink';

const meta = {
  title: 'Shared-UI-Hero-SSR/DataDisplay/Link/Base/FrankLink',
  component: FrankLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '',
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {},
} satisfies Meta<typeof FrankLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Sample Link',
  },
};
