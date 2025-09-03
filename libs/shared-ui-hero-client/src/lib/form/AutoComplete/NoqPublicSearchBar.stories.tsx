import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoqPublicSearchBar } from './NoqPublicSearchBar';
import { useState } from 'react';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/AutoComplete/NoqPublicSearchBar',
  component: NoqPublicSearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A public search bar component combining two autocomplete inputs for specialty search and location search, with a submit button.',
      },
    },
    actions: { argTypesRegex: '^handle.*|on.*' },
  },
  argTypes: {
    height: {
      control: { type: 'number' },
      description: 'Height of the search bar in pixels.',
    },
    searchMainInput: {
      control: false,
      description: 'Configuration for the main specialty search input.',
    },
    searchAddressInput: {
      control: false,
      description: 'Configuration for the address search input.',
    },
    handleSearchSubmit: {
      action: 'handleSearchSubmit',
      description: 'Callback triggered when the search button is pressed.',
    },
  },
  args: {},
  decorators: [
    (Story, context) => {
      const [isLoading, setIsLoading] = useState(false);
      return (
        <div className="w-[90vw] h-[300px] flex items-center justify-center">
          <div className="flex-1">
            <Story
              args={{
                ...context.args,
                handleSearchSubmit: e => {
                  e.preventDefault();
                  setIsLoading(true);
                  console.log('submit');
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 2000);
                },
                isLoading,
              }}
            />
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof NoqPublicSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    height: 64,
    searchAddressInput: {
      allowsCustomValue: true,
    },
    searchMainInput: {
      allowsCustomValue: true,
    },
  },
};
