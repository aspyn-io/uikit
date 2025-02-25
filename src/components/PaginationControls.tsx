import { FC } from 'react';
import { Button, Select } from 'flowbite-react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

type PaginationControlsProps = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  nextPage: string | null;
  prevPage: string | null;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizes?: number[];
};

const PaginationControls: FC<PaginationControlsProps> = ({
  handleNextPage,
  handlePrevPage,
  nextPage,
  prevPage,
  pageSize = 25,
  setPageSize,
  pageSizes = [5, 10, 25, 50],
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <span className="text-sm dark:text-white">Rows per page:</span>
      <Select
        value={String(pageSize)}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="ml-2 w-20"
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
    </div>
    <div className="flex items-center space-x-2">
      <Button color="gray" onClick={handlePrevPage} disabled={!prevPage}>
        <HiChevronLeft className="mr-1" />
        Previous
      </Button>
      <Button color="gray" onClick={handleNextPage} disabled={!nextPage}>
        Next
        <HiChevronRight className="ml-1" />
      </Button>
    </div>
  </div>
);

export default PaginationControls;
