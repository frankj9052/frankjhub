import type { Meta, StoryObj } from '@storybook/react';
import SharedUiHeroClient from './shared-ui-hero-client';

const meta = {
  component: SharedUiHeroClient,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof SharedUiHeroClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
