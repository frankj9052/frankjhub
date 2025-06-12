import type { Meta, StoryObj } from '@storybook/react';
import SharedUiHeroSsr from './shared-ui-hero-ssr';

const meta = {
  component: SharedUiHeroSsr,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },

  args: {},
} satisfies Meta<typeof SharedUiHeroSsr>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
