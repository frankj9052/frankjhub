import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddRoute } from './AddRoute';
import { useState } from 'react';
import { ServiceRoute } from '@frankjhub/shared-schema';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Add/AddRoute',
  component: AddRoute,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '',
      },
    },
    actions: {},
  },

  args: {},
  argTypes: {},
} satisfies Meta<typeof AddRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    routes: [],
    onChange: (next: ServiceRoute[]) => {
      console.log('set routes action', next);
    },
    permissionOptionList: [
      {
        id: '1',
        name: '*:*',
      },
      {
        id: '2',
        name: 'booking:*',
      },
      {
        id: '3',
        name: 'email:["create","update"]',
      },
    ],
  },
  decorators: [
    (Story, context) => {
      const [routes, onChange] = useState<ServiceRoute[]>([]);
      return (
        <div className="w-[800px]">
          <Story
            args={{
              ...context.args,
              routes,
              onChange,
            }}
          />
        </div>
      );
    },
  ],
};
