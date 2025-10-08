import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomContent } from './BottomContent';

const meta = {
  title: 'Shared-UI-Hero-Client/Table/General/TableWithSearchAndFilterParts/BottomContent',
  component: BottomContent,
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
} satisfies Meta<typeof BottomContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 1,
    pageCount: 10,
    handlePageChange: page => {
      console.log('page change to ===> ', page);
    },
  },
  render: args => (
    <div className="w-[800px]">
      <BottomContent {...args} />
    </div>
  ),
};
