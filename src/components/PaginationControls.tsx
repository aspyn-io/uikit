import { FC } from "react";
import { Button, Select } from "flowbite-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props for the PaginationControls component
 * Works with cursor-based pagination from API responses
 */
type PaginationControlsProps = {
  /** Callback to handle navigating to the next page */
  handleNextPage: () => void;
  /** Callback to handle navigating to the previous page */
  handlePrevPage: () => void;
  /**
   * URL for the next page (from API response.page.next or Link header)
   * When null or undefined, the next button will be disabled
   */
  next?: string | null;
  /**
   * URL for the previous page (from API response.page.prev or Link header)
   * When null or undefined, the previous button will be disabled
   */
  prev?: string | null;
  /** Current page size (number of items per page) */
  pageSize: number;
  /** Callback when page size is changed */
  setPageSize: (size: number) => void;
  /** Available page size options. Defaults to [5, 10, 25, 50] */
  pageSizes?: number[];
  /**
   * Total number of items in the collection (from API X-Total-Count header or response.page.totalCount)
   * When provided, displays "1-25 of 4,585" format
   * When omitted, only shows navigation buttons
   */
  totalCount?: number;
  /**
   * Starting index of the current page (1-based)
   * Defaults to 1 if totalCount is provided but startIndex is not
   */
  startIndex?: number;
  /**
   * Ending index of the current page
   * Defaults to min(pageSize, totalCount) if totalCount is provided but endIndex is not
   */
  endIndex?: number;
};

/**
 * Pagination controls component for cursor-based API pagination
 *
 * Features:
 * - Page size selector with customizable options
 * - Previous/Next navigation buttons (icon-only)
 * - Optional item count display ("1-25 of 4,585")
 * - Automatic button disable states based on next/prev URLs
 *
 * Usage with API pagination:
 * ```tsx
 * <PaginationControls
 *   next={response.page.next}
 *   prev={response.page.prev}
 *   totalCount={response.page.totalCount}
 *   startIndex={1}
 *   endIndex={25}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 *   handleNextPage={() => fetchNextPage()}
 *   handlePrevPage={() => fetchPrevPage()}
 * />
 * ```
 *
 * Without count display (navigation only):
 * ```tsx
 * <PaginationControls
 *   next={response.page.next}
 *   prev={response.page.prev}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 *   handleNextPage={() => fetchNextPage()}
 *   handlePrevPage={() => fetchPrevPage()}
 * />
 * ```
 */
export const PaginationControls: FC<PaginationControlsProps> = ({
  handleNextPage,
  handlePrevPage,
  next,
  prev,
  pageSize = 25,
  setPageSize,
  pageSizes = [5, 10, 25, 50],
  totalCount,
  startIndex,
  endIndex,
}) => {
  // Calculate start and end indices if totalCount is provided but indices are not
  const showTotals = typeof totalCount === "number";
  const displayStartIndex = showTotals ? startIndex ?? 1 : undefined;
  const displayEndIndex = showTotals
    ? endIndex ?? Math.min(pageSize, totalCount!)
    : undefined;

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
      <div className="flex items-center justify-between">
        {/* Left side - Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Show</span>
          <Select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            sizing="sm"
            className="w-20"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            per page
          </span>
        </div>

        {/* Right side - Item count display and navigation buttons */}
        <div className="flex items-center gap-4">
          {showTotals && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount! > 0 ? (
                <>
                  {displayStartIndex}-{displayEndIndex} of{" "}
                  {totalCount!.toLocaleString()}
                </>
              ) : (
                "No items"
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <Button
              color="gray"
              size="sm"
              onClick={handlePrevPage}
              disabled={!prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              color="gray"
              size="sm"
              onClick={handleNextPage}
              disabled={!next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
