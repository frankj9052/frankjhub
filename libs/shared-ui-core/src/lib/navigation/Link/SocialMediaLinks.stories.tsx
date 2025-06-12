import type { Meta, StoryObj } from '@storybook/react';
import { SocialMediaLinks } from './SocialMediaLinks';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { SiStorybook } from 'react-icons/si';

const meta = {
  title: 'Shared-UI-Core/Navigation/Link/SocialMediaLinks',
  component: SocialMediaLinks,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible component for displaying social media icons as links, supporting horizontal or vertical layouts based on configuration.',
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: "Layout orientation of the icons. Defaults to 'horizontal'.",
    },
    reactIcons: {
      control: false,
      description: 'Array of social media icons and their corresponding link URLs.',
    },
  },
} satisfies Meta<typeof SocialMediaLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

const reactIcons = [
  {
    reactIcon: <FaGithub className="text-primary" size={24} />,
    href: '#',
  },
  {
    reactIcon: <FaLinkedin className="text-primary" size={24} />,
    href: '#',
  },
  {
    reactIcon: <SiStorybook className="text-primary" size={24} />,
    href: '#',
  },
];

export const Default: Story = {
  args: {
    reactIcons: reactIcons,
  },
  decorators: [
    Story => (
      <div className="w-[300px] h-[300px]">
        <Story />
      </div>
    ),
  ],
};
