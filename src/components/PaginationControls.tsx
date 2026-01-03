import { FC } from "react";
import { Button, Select } from "flowbite-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props for the PaginationControls component
 */
type PaginationControlsProps = {
  /** Callback to handle navigating to the next page */
  handleNextPage: () => void;
  /** Callback to handle navigating to the previous page */
  handlePrevPage: () => void;
  /**
   * Identifier for the next page (e.g., URL, cursor, or page number)
   * When null or undefined, the next button will be disabled
   */
  nextPage?: string | null;
  /**
   * Identifier for the previous page (e.g., URL, cursor, or page number)
   * When null or undefined, the previous button will be disabled
   */
  prevPage?: string | null;
  /** Current page size (number of items per page) */
  pageSize: number;
  /** Callback when page size is changed */
  setPageSize: (size: number) => void;
  /** Available page size options. Defaults to [5, 10, 25, 50] */
  pageSizes?: number[];
  /**
   * Total number of items in the collection
   * When provided, displays "1-25 of 4,585" format
   * When omitted, only shows navigation buttons
   */
  totals?: number;
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
 * Pagination controls component
 *
 * Features:
 * - Page size selector with customizable options
 * - Previous/Next navigation buttons (icon-only)
 * - Optional item count display ("1-25 of 4,585")
 * - Automatic button disable states based on nextPage/prevPage availability
 *
 * Usage with item count:
 * ```tsx
 * <PaginationControls
 *   nextPage={nextPageIdentifier}
 *   prevPage={prevPageIdentifier}
 *   totals={4585}
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
 *   nextPage={nextPageIdentifier}
 *   prevPage={prevPageIdentifier}
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
              {totals! > 0 ? (
                <>
                  {displayStartIndex}-{displayEndIndex} of{" "}
                  {totals!.toLocaleString()}
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
              disabled={!prevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              color="gray"
              size="sm"
              onClick={handleNextPage}
              disabled={!nextPage}
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
