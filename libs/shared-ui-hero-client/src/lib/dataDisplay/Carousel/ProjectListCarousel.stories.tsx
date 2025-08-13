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
        component:
          'ProjectListCarousel is a responsive carousel component that displays a list of project cards with navigation arrows and pagination dots. Clicking on a project opens a modal showing detailed information.',
      },
    },
    actions: { argTypesRegex: '^on.*' }, // ✅ 修复类型
  },
  argTypes: {
    width: {
      description: 'Optional fixed width (in pixels) of the entire carousel',
      control: { type: 'number', min: 300, step: 50 },
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1000' },
      },
    },
    projects: {
      description: 'List of project data to render',
      table: {
        type: { summary: 'ProjectData[]' },
      },
      control: false, // 通常不在 UI 中编辑这个结构
    },
  },
  args: {
    projects: carouselProjects,
    width: 1000,
  },
} satisfies Meta<typeof ProjectListCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default 1000px wide carousel with full project list */
export const Default: Story = {
  args: {
    projects: carouselProjects,
    width: 1000,
  },
};

/** Narrower carousel to show fewer slides at once */
export const Narrow: Story = {
  args: {
    projects: carouselProjects,
    width: 600,
  },
};

/** Carousel with only a few projects to test edge case */
export const ShortList: Story = {
  args: {
    projects: carouselProjects.slice(0, 2),
    width: 800,
  },
};

/** Carousel that fills parent container */
export const FullWidth: Story = {
  args: {
    projects: carouselProjects,
    width: undefined,
  },
};
