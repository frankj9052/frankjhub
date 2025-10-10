import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddPermission } from './AddPermission';
import { useState } from 'react';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/Forms/Add/AddPermission',
  component: AddPermission,
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

  args: {
    value: [],
    onChange: (next: string[]) => {
      console.log('onChange event', next.join(','));
    },
  },
  argTypes: {},
} satisfies Meta<typeof AddPermission>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
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
      const [value, setValue] = useState<string[]>([]);
      return (
        <div>
          <Story
            args={{
              ...context.args,
              value,
              onChange: next => {
                setValue(next);
              },
            }}
          />
        </div>
      );
    },
  ],
};
