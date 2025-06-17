import type { Meta, StoryObj } from '@storybook/react-vite';
import SharedUi from './HeroTitle';

const meta = {
  title: 'Shared-UI-Core/StaticEffects/HeroTitle',
  component: SharedUi,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A styled hero title component that displays a large background-styled heading (h1) and a bold foreground heading (h2) with an underline effect, used to create impactful section headers.',
      },
    },
    actions: {},
  },
  argTypes: {
    children: {
      control: false,
      description: 'Text or elements to render as the hero title content.',
    },
  },
  args: {},
} satisfies Meta<typeof SharedUi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'About Me',
  },
};
