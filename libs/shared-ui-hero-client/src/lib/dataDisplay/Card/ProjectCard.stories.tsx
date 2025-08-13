import { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCard } from './ProjectCard';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Card/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: {
      height: 834,
      width: 1743,
      alt: 'website-01',
      src: 'https://ceblog.s3.amazonaws.com/wp-content/uploads/2018/08/28135856/Homepage-Design-Dropbox.png',
    },
    title: 'Dropbox Homepage redesign',
    subTitle: 'Product / Web Design · 2018',
  },
};
