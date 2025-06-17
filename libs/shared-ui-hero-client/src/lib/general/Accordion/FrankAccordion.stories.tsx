import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccordionItemType, FrankAccordion } from './FrankAccordion';
import { FaMinus, FaPlus } from 'react-icons/fa6';
const meta = {
  title: 'Shared-UI-Hero-Client/General/Accordion/FrankAccordion',
  component: FrankAccordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'FrankAccordion is a flexible and customizable accordion component built with @heroui/react. It supports controlled and uncontrolled states, multiple visual variants, and various interaction options for dynamic content presentation.',
      },
    },
    actions: {
      handles: ['setSelectedKeys'],
    },
  },

  args: {},
  argTypes: {
    items: {
      control: false,
      description:
        'List of accordion items to render, each containing a title, content, ARIA label, and optional subtitle and indicators.',
    },
    selectionMode: {
      control: { type: 'radio' },
      options: ['multiple', 'single', 'none'],
      description:
        'Selection behavior: allows multiple, single, or no item to be expanded at a time.',
    },
    variant: {
      control: { type: 'radio' },
      options: ['splitted', 'light', 'shadow', 'bordered'],
      description: 'Visual style variant of the accordion.',
    },
    defaultExpandedKeys: {
      control: false,
      description: 'Set of item keys that should be expanded by default on initial render.',
    },
    disabledKeys: {
      control: false,
      description: 'Set of item keys that should be disabled from interaction.',
    },
    selectedKeys: {
      control: false,
      description: 'Controlled selected keys; overrides internal state if provided.',
    },
    setSelectedKeys: {
      action: 'setSelectedKeys',
      description: 'Callback to update the controlled selected keys externally.',
    },
    hideShadow: {
      control: 'boolean',
      description: 'Whether to remove shadow styling from accordion items.',
    },
    width: {
      control: { type: 'number' },
      description: 'Width of the accordion container in pixels; defaults to 100% if not specified.',
    },
    disableIndicatorAnimation: {
      control: 'boolean',
      description: 'Disables the indicator animation if set to true.',
    },
  },
} satisfies Meta<typeof FrankAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: AccordionItemType[] = [
  {
    ariaLabel: 'What is Noq Clinic, and how does it work?',
    title: 'What is Noq Clinic, and how does it work?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
  {
    ariaLabel: 'How do I search for a doctor on Noq Clinic?',
    title: 'How do I search for a doctor on Noq Clinic?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
  {
    ariaLabel: 'Is Noq Clinic free to use for patients?',
    title: 'Is Noq Clinic free to use for patients?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
  {
    ariaLabel: 'What types of healthcare providers are available on Noq Clinic?',
    title: 'What types of healthcare providers are available on Noq Clinic?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
  {
    ariaLabel: 'How do I know if a doctor is accepting new patients?',
    title: 'How do I know if a doctor is accepting new patients?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
  {
    ariaLabel: 'Can I book appointments for family members?',
    title: 'Can I book appointments for family members?',
    content:
      'Noq Clinic is an online healthcare booking platform that helps you find and book appointments with trusted doctors, specialists, and healthcare providers. Simply search for a doctor based on specialty, location, or availability, select a time that works for you, and confirm your appointment—all in just a few clicks.',
  },
];

export const Default: Story = {
  args: {
    hideShadow: true,
    width: 512,
    variant: 'splitted',
    disableIndicatorAnimation: true,
    items: items.map((item, index) => ({
      ariaLabel: item.ariaLabel,
      title: <div className="font-[500] font-inter text-[#313131]">{item.title}</div>,
      content: <div className="text-[14px] font-inter text-[#666]">{item.content}</div>,
      key: index,
      indicator: {
        isOpen: <FaMinus className="text-[#313131]" />,
        isClose: <FaPlus className="text-[#313131]" />,
      },
    })),
  },
};
