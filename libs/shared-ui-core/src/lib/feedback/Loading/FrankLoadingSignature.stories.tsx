import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankLoadingSignature } from './FrankLoadingSignature';

const meta = {
  title: 'Shared-UI-Core/Feedback/Loading/FrankLoadingSignature',
  component: FrankLoadingSignature,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankLoadingSignature is a custom loading component combining a signature-style SVG animation with a spinner, providing a branded loading experience.',
      },
    },
    actions: {},
  },

  args: {},
} satisfies Meta<typeof FrankLoadingSignature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
