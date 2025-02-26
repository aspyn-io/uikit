import type { Meta, StoryObj } from '@storybook/react';
import PaginationControls from '../components/PaginationControls';

const meta = {
  title: "components/PaginationControls",
  component: PaginationControls,
} satisfies Meta<typeof PaginationControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleNextPage: () => {},
    handlePrevPage: () => {},
    nextPage: '',
    prevPage: '',
    pageSize: 0,
    setPageSize: () => {}
  }
};