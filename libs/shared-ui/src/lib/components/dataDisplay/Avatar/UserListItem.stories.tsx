import type { Meta, StoryObj } from '@storybook/react';
import { UserListItem } from './UserListItem';

const meta = {
  title: 'Components/DataDisplay/Avatar/UserListItem',
  component: UserListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: "A simple user list item component displaying a user's avatar, name, and email.",
      },
    },
    actions: {},
  },
  argTypes: {
    user: {
      control: false,
      description: 'User information to display, including name, image, and email.',
    },
  },
  args: {},
} satisfies Meta<typeof UserListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: 'Frank',
      email: 'frank@test.com',
    },
  },
};

export const WithImage: Story = {
  args: {
    user: {
      name: 'Frank',
      email: 'frank@test.com',
      image: 'https://img.0756bf.com/uploads/allimg/2021042109/uqaqhuvavt0.jpg',
    },
  },
};
