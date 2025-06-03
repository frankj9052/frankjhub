import type { Meta, StoryObj } from '@storybook/react';
import FrankModal from './FrankModal';
import { useDisclosure } from '@heroui/react';
import { FrankButtonBase } from '../../general';

const meta = {
  title: 'Components/Feedback/Modal/FrankModal',
  component: FrankModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A highly customizable modal component based on @heroui/react Modal, supporting draggable behavior, optional header and footer visibility, flexible placement, backdrop customization, and footer buttons.',
      },
    },
    actions: {
      handles: ['onClose'],
    },
  },

  args: {
    isOpen: undefined,
    onClose: undefined,
    draggable: true,
  },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Whether the modal is currently open.',
    },
    onClose: {
      action: 'onClose',
      description: 'Callback triggered when the modal is requested to close.',
    },
    header: {
      control: false,
      description: 'Content to display in the modal header.',
    },
    body: {
      control: false,
      description: 'Content to display in the modal body.',
    },
    footerButtons: {
      control: false,
      description: 'Array of button configurations to display in the modal footer.',
    },
    imageModal: {
      control: { type: 'boolean' },
      description: 'If true, renders a minimal modal optimized for displaying images.',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'full'],
      description: 'Size of the modal.',
    },
    placement: {
      control: { type: 'select' },
      options: ['center', 'top-center', 'auto', 'top', 'bottom', 'bottom-center'],
      description: "Placement of the modal on the screen. Defaults to 'top-center'.",
    },
    backdrop: {
      control: { type: 'select' },
      options: ['transparent', 'opaque', 'blur'],
      description: "Type of backdrop behind the modal. Defaults to 'transparent'.",
    },
    draggable: {
      control: { type: 'boolean' },
      description: 'Whether the modal can be dragged around the screen. Defaults to false.',
    },
    hideCloseButton: {
      control: { type: 'boolean' },
      description: 'Whether to hide the close button. Defaults to false.',
    },
    hideHeaderAndFooter: {
      control: { type: 'boolean' },
      description: 'Whether to hide both the header and footer sections. Defaults to false.',
    },
    zIndex: {
      control: { type: 'number' },
      description: 'z-index value for the modal to control layering. Defaults to 50.',
    },
  },
  decorators: [
    (Story, context) => {
      const { onOpen, isOpen, onClose } = useDisclosure();
      return (
        <div className="relative">
          <FrankButtonBase
            onPress={onOpen}
            customizeContent={<div>Open Modal</div>}
            width={120}
            height={30}
            variant="solid"
          />
          <Story
            args={{
              ...context.args,
              isOpen,
              onClose,
            }}
          />
          <div className="z-50 absolute left-0 top-0">Test Area</div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof FrankModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    body: <div>This is modal body</div>,
    hideCloseButton: false,
    hideHeaderAndFooter: false,
    footerButtons: [
      {
        customizeContent: 'Footer Button',
      },
    ],
  },
};
