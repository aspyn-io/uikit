import type { Meta, StoryObj } from '@storybook/react-vite';
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
    pageSize: 25,
    setPageSize: () => {}
  }
};

export const WithTotals: Story = {
  args: {
    handleNextPage: () => {},
    handlePrevPage: () => {},
    nextPage: '',
    prevPage: '',
    pageSize: 25,
    setPageSize: () => {},
    totals: 100,
    startIndex: 1,
    endIndex: 25
  }
};

export const WithTotalsLastPage: Story = {
  args: {
    handleNextPage: () => {},
    handlePrevPage: () => {},
    nextPage: null,
    prevPage: '',
    pageSize: 25,
    setPageSize: () => {},
    totals: 100,
    startIndex: 76,
    endIndex: 100
  }
};