import type { Meta, StoryObj } from '@storybook/react';
import NoqButton from './NoqButton';
import { FrankSVGIcon } from '../../icons';

const meta = {
  title: 'Components/General/Button/NoqButton',
  component: NoqButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable button component with theming, loading state, and optional icons, designed for consistent styling across different usage scenarios.',
      },
    },
    actions: { argTypesRegex: '^handle.*|^on.*' },
  },
  tags: ['autodocs'],

  args: {
    handleClick: () => {
      console.log('Button clicked');
    },
    loading: false,
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['Default', 'Brand', 'Ghost'],
      description: 'Visual theme of the button.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Predefined size of the button (small, medium, large).',
    },
    isDisabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled.',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the button shows a loading spinner.',
    },
    icon: {
      control: false,
      description: 'Icon to display inside the button.',
    },
    text: {
      control: { type: 'text' },
      description: 'Text label inside the button.',
    },
    textStyle: {
      control: { type: 'text' },
      description: 'Additional className(s) for styling the text.',
    },
    handleClick: {
      action: 'handleClick',
      description: 'Callback triggered when the button is clicked.',
    },
    height: {
      control: { type: 'number' },
      description: 'Custom height of the button in pixels (if size is not set).',
    },
    width: {
      control: { type: 'number' },
      description: 'Custom width of the button in pixels (if size is not set).',
    },
  },
} satisfies Meta<typeof NoqButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: 'Brand',
    size: 'md',
    icon: (
      <FrankSVGIcon viewBox="0 0 20 20" width={20} height={20}>
        <path
          d="M8.81713 11.3463L6.8813 9.41021C6.76588 9.29493 6.62081 9.2359 6.44609 9.23312C6.2715 9.23049 6.1238 9.28951 6.00296 9.41021C5.88227 9.53104 5.82192 9.67743 5.82192 9.84937C5.82192 10.0213 5.88227 10.1677 6.00296 10.2885L8.28984 12.5752C8.44053 12.7259 8.6163 12.8012 8.81713 12.8012C9.01796 12.8012 9.19373 12.7259 9.34442 12.5752L13.9807 7.93917C14.0959 7.82375 14.155 7.67868 14.1578 7.50396C14.1604 7.32938 14.1014 7.18167 13.9807 7.06083C13.8598 6.94014 13.7134 6.87979 13.5415 6.87979C13.3696 6.87979 13.2232 6.94014 13.1023 7.06083L8.81713 11.3463ZM4.42296 17.0833C4.00741 17.0833 3.65241 16.9362 3.35796 16.6419C3.06366 16.3474 2.9165 15.9924 2.9165 15.5769V4.42313C2.9165 4.00757 3.06366 3.65257 3.35796 3.35812C3.65241 3.06382 4.00741 2.91667 4.42296 2.91667H8.1313C8.18366 2.45403 8.3856 2.06062 8.73713 1.73646C9.08852 1.41215 9.50942 1.25 9.99984 1.25C10.4955 1.25 10.9191 1.41215 11.2707 1.73646C11.6222 2.06062 11.8214 2.45403 11.8684 2.91667H15.5767C15.9923 2.91667 16.3473 3.06382 16.6417 3.35812C16.936 3.65257 17.0832 4.00757 17.0832 4.42313V15.5769C17.0832 15.9924 16.936 16.3474 16.6417 16.6419C16.3473 16.9362 15.9923 17.0833 15.5767 17.0833H4.42296ZM4.42296 15.8333H15.5767C15.6409 15.8333 15.6996 15.8066 15.753 15.7531C15.8064 15.6998 15.8332 15.641 15.8332 15.5769V4.42313C15.8332 4.35896 15.8064 4.30021 15.753 4.24687C15.6996 4.1934 15.6409 4.16667 15.5767 4.16667H4.42296C4.3588 4.16667 4.30005 4.1934 4.24671 4.24687C4.19324 4.30021 4.1665 4.35896 4.1665 4.42313V15.5769C4.1665 15.641 4.19324 15.6998 4.24671 15.7531C4.30005 15.8066 4.3588 15.8333 4.42296 15.8333ZM9.99984 3.62187C10.1804 3.62187 10.3297 3.56285 10.4478 3.44479C10.5658 3.32674 10.6248 3.17743 10.6248 2.99687C10.6248 2.81632 10.5658 2.66701 10.4478 2.54896C10.3297 2.4309 10.1804 2.37187 9.99984 2.37187C9.81928 2.37187 9.66998 2.4309 9.55192 2.54896C9.43387 2.66701 9.37484 2.81632 9.37484 2.99687C9.37484 3.17743 9.43387 3.32674 9.55192 3.44479C9.66998 3.56285 9.81928 3.62187 9.99984 3.62187Z"
          fill="#E4FFE5"
        />
      </FrankSVGIcon>
    ),
    text: 'Arrived',
    textStyle: 'flex items-center justify-center',
  },
};

export const OpenAddTreatmentModalBtn: Story = {
  args: {
    handleClick: () => {
      console.log('click');
    },
    icon: (
      <FrankSVGIcon viewBox="0 0 20 20" width={20} height={20}>
        <path
          d="M9.75 10.25H4.75C4.5375 10.25 4.35942 10.1781 4.21575 10.0342C4.07192 9.89042 4 9.71225 4 9.49975C4 9.28708 4.07192 9.109 4.21575 8.9655C4.35942 8.82183 4.5375 8.75 4.75 8.75H9.75V3.75C9.75 3.5375 9.82192 3.35942 9.96575 3.21575C10.1096 3.07192 10.2878 3 10.5003 3C10.7129 3 10.891 3.07192 11.0345 3.21575C11.1782 3.35942 11.25 3.5375 11.25 3.75V8.75H16.25C16.4625 8.75 16.6406 8.82192 16.7843 8.96575C16.9281 9.10958 17 9.28775 17 9.50025C17 9.71292 16.9281 9.891 16.7843 10.0345C16.6406 10.1782 16.4625 10.25 16.25 10.25H11.25V15.25C11.25 15.4625 11.1781 15.6406 11.0342 15.7843C10.8904 15.9281 10.7122 16 10.4997 16C10.2871 16 10.109 15.9281 9.9655 15.7843C9.82183 15.6406 9.75 15.4625 9.75 15.25V10.25Z"
          fill="#4A4A4A"
        />
      </FrankSVGIcon>
    ),
    size: 'md',
    theme: 'Default',
    text: 'Label',
  },
};

export const SignUpForFree: Story = {
  args: {
    handleClick: () => {
      console.log('click');
    },
    theme: 'Brand',
    text: 'Sign up for Free!',
    width: 262,
    height: 60,
    textStyle: 'text-center w-full',
  },
};
