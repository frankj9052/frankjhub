import type { Meta, StoryObj } from '@storybook/react-vite';
import FrankCheckbox from './FrankCheckbox';

const meta = {
  title: 'Shared-UI-Hero-Client/Form/FormFields/Checkbox/FrankCheckbox',
  component: FrankCheckbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable checkbox component that supports adding content inside or outside the label, with adjustable colors, sizes, and spacing for flexible layout needs.',
      },
    },
    actions: {},
  },
  argTypes: {
    insideContent: {
      control: false,
      description: 'Content displayed inside the checkbox label.',
    },
    outsideContent: {
      control: false,
      description: 'Content displayed next to the checkbox, outside the main label.',
    },
    value: {
      control: { type: 'text' },
      description: 'The value associated with the checkbox input.',
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled.',
    },
    defaultSelected: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is initially selected.',
    },
    color: {
      control: { type: 'color' },
      description: "Custom color for the selected state background. Defaults to '#003f3c'.",
    },
    checkboxHeight: {
      control: { type: 'number' },
      description: 'Height of the checkbox container in pixels.',
    },
    gap: {
      control: { type: 'select' },
      options: [
        0,
        1,
        'px',
        0.5,
        1.5,
        2,
        2.5,
        3,
        3.5,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        14,
        16,
        20,
        24,
        28,
        32,
        36,
        40,
        44,
        48,
        52,
        56,
        60,
        64,
        72,
        80,
        96,
      ],
      description: 'Spacing between the checkbox and the outside content.',
    },
  },
  args: {},

  decorators: [
    Story => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof FrankCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    insideContent: 'text check',
    value: 'test value 1',
  },
};

export const OutSideContent: Story = {
  args: {
    outsideContent: <div className="bg-blue-200 w-[100px] h-[200px]"> big component</div>,
    value: 'test value 1',
    checkboxHeight: 24,
    insideContent: <p className="font-bold">Mon</p>,
    gap: 2,
  },
};
