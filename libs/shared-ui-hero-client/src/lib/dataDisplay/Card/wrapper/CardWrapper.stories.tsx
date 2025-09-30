import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardWrapper } from './CardWrapper';
import { GiPadlock } from 'react-icons/gi';
import { RootRegisterForm } from '../../../form';

const meta = {
  title: 'Shared-UI-Hero-Client/DataDisplay/Card/Wrapper/CardWrapper',
  component: CardWrapper,
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
} satisfies Meta<typeof CardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headerText: 'Clinic Register',
    subHeaderText: 'Welcome to NoQclinic',
    headerIcon: GiPadlock,
    body: (
      <RootRegisterForm
        onSubmit={values => {
          console.log('form data submitted ===> ', values);
        }}
        token="test token!"
      />
    ),
  },
  render: args => (
    <div>
      <CardWrapper {...args} />
    </div>
  ),
};
