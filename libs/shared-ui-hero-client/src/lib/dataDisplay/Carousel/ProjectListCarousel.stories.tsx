import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectListCarousel } from './ProjectListCarousel';
import { carouselProjects } from './carouselProjects';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Carousel/ProjectListCarousel',
  component: ProjectListCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '...',
      },
    },
    actions: {},
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof ProjectListCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projects: carouselProjects,
    width: 1000,
  },
};
