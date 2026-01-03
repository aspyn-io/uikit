import { FC } from "react";
import { Button, Select } from "flowbite-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  nextPage: string | null;
  prevPage: string | null;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizes?: number[];
  /** Total number of items in the collection */
  totals?: number;
  /** Starting index of the current page (1-based). Defaults to 1 if totals is provided */
  startIndex?: number;
  /** Ending index of the current page. Defaults to min(pageSize, totals) if totals is provided */
  endIndex?: number;
};

export const PaginationControls: FC<PaginationControlsProps> = ({
  handleNextPage,
  handlePrevPage,
  nextPage,
  prevPage,
  pageSize = 25,
  setPageSize,
  pageSizes = [5, 10, 25, 50],
  totals,
  startIndex,
  endIndex,
}) => {
  // Calculate start and end indices if totals is provided but indices are not
  const showTotals = typeof totals === "number";
  const displayStartIndex = showTotals ? startIndex ?? 1 : undefined;
  const displayEndIndex = showTotals
    ? endIndex ?? Math.min(pageSize, totals!)
    : undefined;

  return (
    <div className="flex flex-row items-center justify-between gap-3 sm:gap-0">
      <div className="flex items-center">
        <span className="text-sm dark:text-white hidden sm:inline">
          Rows per page:
        </span>
        <span className="text-sm dark:text-white sm:hidden">Per page:</span>
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
        {showTotals && (
          <div className="text-sm text-gray-700 dark:text-gray-400">
            {displayStartIndex}-{displayEndIndex} of {totals?.toLocaleString()}
          </div>
        )}
        <Button
          onClick={handlePrevPage}
          disabled={!prevPage}
          className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="self-center" />
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!nextPage}
          className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="self-center" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
