import type { Meta, StoryObj } from '@storybook/react-vite';
import { FrankAutocomplete } from './FrankAutocomplete';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { IoSearchOutline } from 'react-icons/io5';
import { FrankAutocompleteItem } from './FrankAutocompleteItem';

const defaultItems = Array.from({ length: 30 }, (_, i) => {
  const labelText =
    i < 20 ? `Doctor ${String(i + 1).padStart(2, '0')}` : `Cat ${String(i - 19).padStart(2, '0')}`;
  return {
    key: `id${String(i + 1).padStart(2, '0')}`,
    label: <div className="text-[13px]">{labelText}</div>,
    textValue: labelText,
  };
});

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/AutoComplete/Base/FrankAutocomplete',
  component: FrankAutocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable Autocomplete component built on top of @heroui/react, with additional style and behavior controls.',
      },
    },
    actions: { argTypesRegex: '^on.*' },
  },
  argTypes: {
    ariaLabel: {
      control: { type: 'text' },
      description: 'Accessibility label for the autocomplete input.',
    },
    className: {
      control: { type: 'text' },
      description: 'Custom className for the wrapper div.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the input field.',
    },
    defaultItems: {
      control: false,
      description: 'List of items to display as suggestions.',
    },
    defaultFilter: {
      control: { type: 'boolean' },
      description: 'Whether to use the default filtering behavior. Defaults to true.',
    },
    variant: {
      control: { type: 'select' },
      options: ['flat', 'faded', 'bordered', 'underlined', 'ghost'],
      description: 'Visual style variant of the input.',
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'none', 'full'],
      description: 'Border radius of the input field.',
    },
    selectedKey: {
      control: { type: 'text' },
      description: 'Currently selected item key.',
    },
    onSelectionChange: {
      action: 'onSelectionChange',
      description: 'Callback triggered when the selection changes.',
    },
    inputValue: {
      control: { type: 'text' },
      description: 'Current value of the input field.',
    },
    onInputChange: {
      action: 'onInputChange',
      description: 'Callback triggered when the input value changes.',
    },
    endContent: {
      control: false,
      description: 'Element displayed at the end of the input.',
    },
    startContent: {
      control: false,
      description: 'Element displayed at the start of the input.',
    },
    classNames: {
      control: false,
      description: 'Custom styles for input text, clear button, and content area.',
    },
    fullWidth: {
      control: { type: 'number' },
      description: 'Width of the component in pixels.',
    },
  },
  args: {},
} satisfies Meta<typeof FrankAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

type PredictionsType = {
  description: string;
  matched_substrings: any[];
  place_id: string;
  reference: string;
  structured_formatting: any;
  terms: any[];
  types: string[];
};

export const Default: Story = {
  args: {
    ariaLabel: 'storybook test',
    placeholder: 'Enter Address',
    variant: 'bordered',
    radius: 'sm',
    onSelectionChange: key => {
      console.log('key ===> ', key);
    },
    endContent: <IoSearchOutline />,
    fullWidth: true,
    children: <FrankAutocompleteItem>label</FrankAutocompleteItem>,
  },
  decorators: [
    (Story, context) => {
      const [input, setInput] = useState<string>('');
      const [predictions, setPredictions] = useState<PredictionsType[]>([]);
      const fetchPredictions = useRef(
        debounce((query: string | undefined) => {
          if (query && query.length > 0) {
            const url = `http://localhost:5000/public/googleApi/autoComplete?input=${query}`;
            axios
              .get(url)
              .then(response => {
                setPredictions(response.data);
              })
              .catch(error => {
                console.log('error ===> ', error);
                // temp test
                setPredictions([
                  {
                    description: query ?? '',
                    matched_substrings: [],
                    place_id: '',
                    reference: '',
                    structured_formatting: undefined,
                    terms: [],
                    types: [],
                  },
                ]);
              });
          } else {
            setPredictions([]);
          }
        }, 500)
      ).current;

      useEffect(() => {
        fetchPredictions(input);
      }, [input, fetchPredictions]);

      return (
        <div className="w-[288px]">
          <Story
            args={{
              ...context.args,
              inputValue: input,
              onInputChange: value => {
                setInput(value);
              },
              defaultItems: predictions.map(prediction => ({
                label: prediction.description,
                key: prediction.description,
                textValue: prediction.description,
              })),
            }}
          />
        </div>
      );
    },
  ],
};

export const ProviderAutocomplete: Story = {
  args: {
    ariaLabel: 'storybook test',
    placeholder: 'Select a provider',
    variant: 'bordered',
    radius: 'sm',
    defaultItems: defaultItems,
    children: <FrankAutocompleteItem>label</FrankAutocompleteItem>,
  },
};
