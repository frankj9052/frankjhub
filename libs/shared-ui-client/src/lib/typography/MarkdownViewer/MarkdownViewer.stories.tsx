import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownViewer } from './MarkdownViewer';

const meta = {
  title: 'Shared-UI-Client/Typography/MarkdownViewer/MarkdownViewer',
  component: MarkdownViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof MarkdownViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: '/assets/privacy-policy.md',
  },
};
