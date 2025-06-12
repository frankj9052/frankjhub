import type { Meta, StoryObj } from '@storybook/react';
import FrankTopNav from './FrankTopNav';
import { NavLinkType } from '@frankjhub/shared-utils';
import Link from 'next/link';

const meta = {
  title: 'Shared-UI-Hero-Client/Navigation/Navbar/FrankTopNav',
  component: FrankTopNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'top',
    docs: {
      description: {
        component:
          'A responsive top navigation bar component built with @heroui/react, featuring a brand section, navigation links, and optional end content like buttons or icons.',
      },
    },
    actions: {},
  },
  argTypes: {
    navbarBrand: {
      control: false,
      description: 'Content for the brand/logo area on the left side of the navbar.',
    },
    navLinks: {
      control: false,
      description: 'Array of navigation links, each with text and href properties.',
    },
    navContentEnd: {
      control: false,
      description: 'Content displayed on the right side of the navbar, such as buttons or icons.',
    },
  },
  args: {},
  decorators: [
    Story => {
      return (
        <div className="w-screen">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof FrankTopNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const navLinks: NavLinkType[] = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/skill', text: 'Skill' },
  { href: '/portfolio', text: 'Portfolio' },
  { href: '/contact', text: 'Contact' },
];

export const Default: Story = {
  args: {
    navbarBrand: <TextBrand />,
    navLinks: navLinks,
  },
};

function TextBrand() {
  return (
    <Link className="text-primary-900 font-semibold text-[1.3rem]" href={'/'}>
      Frank Jia
    </Link>
  );
}
