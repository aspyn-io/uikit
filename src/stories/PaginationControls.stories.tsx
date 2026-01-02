import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import PaginationControls from "../components/PaginationControls";

const meta = {
  title: "components/PaginationControls",
  component: PaginationControls,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PaginationControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    handleNextPage: () => {},
    handlePrevPage: () => {},
    next: "",
    prev: "",
    pageSize: 25,
    setPageSize: () => {},
  },
};

export const WithTotals: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const totalCount = 4585;
    
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);
    
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    
    const handleNextPage = () => {
      if (hasNext) setCurrentPage(currentPage + 1);
    };
    
    const handlePrevPage = () => {
      if (hasPrev) setCurrentPage(currentPage - 1);
    };
    
    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when changing page size
    };
    
    return (
      <PaginationControls
        next={hasNext ? "next-page" : null}
        prev={hasPrev ? "prev-page" : null}
        totalCount={totalCount}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />
    );
  },
};

export const WithTotalsLastPage: Story = {
  render: () => {
    const [pageSize, setPageSize] = useState(25);
    const totalCount = 100;
    const totalPages = Math.ceil(totalCount / pageSize);
    const [currentPage, setCurrentPage] = useState(totalPages); // Start on last page
    
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);
    
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    
    const handleNextPage = () => {
      if (hasNext) setCurrentPage(currentPage + 1);
    };
    
    const handlePrevPage = () => {
      if (hasPrev) setCurrentPage(currentPage - 1);
    };
    
    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      const newTotalPages = Math.ceil(totalCount / size);
      setCurrentPage(newTotalPages); // Go to last page with new size
    };
    
    return (
      <PaginationControls
        next={hasNext ? "next-page" : null}
        prev={hasPrev ? "prev-page" : null}
        totalCount={totalCount}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
      />
    );
  },
};
