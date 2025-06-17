import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavLinkClient } from './NavLinkClient';

const meta = {
  title: 'Shared-UI-Client/Navigation/NavLinks/NavLinkClient',
  component: NavLinkClient,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'NavLinkClient is a navigation link component for navbar usage. It supports `hover` effects and active styling via the `isActive` prop.',
      },
    },
  },
  argTypes: {
    text: {
      description: 'Text content of the navigation link.',
      control: 'text',
    },
    href: {
      description: 'The navigation target URL.',
      control: 'text',
    },
    isActive: {
      description: 'Whether the link is currently active.',
      control: 'boolean',
    },
  },
  args: {
    text: 'Home',
    href: '/',
    isActive: true,
  },
} satisfies Meta<typeof NavLinkClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Home',
    href: '/',
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    text: 'About',
    href: '/about',
    isActive: false,
  },
};
