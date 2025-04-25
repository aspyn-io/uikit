import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  MouseEvent,
  ChangeEvent,
} from 'react';
import { Label, Checkbox } from 'flowbite-react';
import { HiSearch, HiOutlineChevronDown, HiX } from 'react-icons/hi';

// ---------- Types and Interfaces ---------- //

/** Structure for an option’s value and label.
 *  You can extend this with extra fields as needed. */
export interface SearchableOption {
  value: string | number;
  label?: string | number;
}

export interface SearchableSelectProps {
  /** The unique ID for the main button/input. */
  id?: string;
  /** The name attribute for the underlying form input (if applicable). */
  name?: string;
  /** Label text shown above the select. */
  label?: string;
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string;
  /** Whether the field is required (affects label styling). */
  required?: boolean;
  /** Whether the entire component is disabled. */
  disabled?: boolean;
  /** Single select (false) or multi-select (true). */
  multiple?: boolean;
  /** Whether the select can be reset by clicking X button (only applies to single select) */
  resetable?: boolean;
  /** Child elements: <SearchableSelect.Search/>, <SearchableSelect.Option/>, etc. */
  children?: ReactNode;
  /** Callback when selection changes. */
  onChange?: (value: SearchableOption | SearchableOption[] | null) => void;
  /** Controlled value from parent. */
  value?: SearchableOption | SearchableOption[] | null;
  /** Extra classes for outer container. */
  className?: string;
  /** Size variant for text: 'sm', 'md', or 'lg'. */
  size?: 'sm' | 'md' | 'lg';
  /** Helper text or hint below the select. */
  helperText?: string;
  /** Whether this field is in an error state (affects styling). */
  error?: boolean;
  wrap?: boolean;
}

interface SearchableSelectContextValue {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedValues: SearchableOption[] | SearchableOption | null;
  handleSelectionChange: (newValue: SearchableOption) => void;
  multiple: boolean;
}

// ---------- Context Setup ---------- //

const SearchableSelectContext =
  createContext<SearchableSelectContextValue | null>(null);

// ---------- Main Component ---------- //

export const SearchableSelect: FC<SearchableSelectProps> & {
  Search: FC<SearchProps>;
  Option: FC<OptionProps>;
  OptionGroup: FC<OptionGroupProps>;
  NoResults: FC<NoResultsProps>;
  Loading: FC<LoadingProps>;
  Pagination: FC<PaginationProps>;
} = ({
  id,
  name,
  label,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  multiple = false,
  resetable = false,
  children,
  onChange,
  value,
  className = '',
  size = 'md',
  helperText,
  error = false,
  wrap = true,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<
    SearchableOption[] | SearchableOption | null
  >(multiple ? [] : null);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    if (typeof value !== 'undefined') {
      setSelectedValues(value);
    }
  }, [value]);

  useEffect(() => {
    if (multiple) {
      // Ensure selectedValues is an array when switching to multiple mode
      setSelectedValues((prev) =>
        prev ? (Array.isArray(prev) ? prev : [prev]) : []
      );
    } else {
      // Ensure selectedValues is a single object when switching to single mode
      setSelectedValues((prev) =>
        Array.isArray(prev) ? prev[0] || null : prev
      );
    }
  }, [multiple]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, []);

  // Handle selection changes
  const handleSelectionChange = (newValue: SearchableOption) => {
    if (multiple) {
      // Ensure selectedValues is always an array
      const current: SearchableOption[] = Array.isArray(selectedValues)
        ? selectedValues
        : selectedValues
          ? [selectedValues]
          : [];

      const exists = current.some((v) => v.value === newValue.value);
      let updatedValues: SearchableOption[];

      if (exists) {
        // Remove if it already exists
        updatedValues = current.filter((v) => v.value !== newValue.value);
      } else {
        // Add if it doesn't exist
        updatedValues = [...current, newValue];
      }

      setSelectedValues(updatedValues);
      onChange?.(updatedValues);
      // Reset search term after selection
      setSearchTerm('');
    } else {
      // Single select: replace the value
      setSelectedValues(newValue);
      onChange?.(newValue);
      setIsOpen(false);
      // Reset search term after selection
      setSearchTerm('');
    }
  };


  // Handle removing a tag in multi-select mode
  const handleRemoveTag = (valToRemove: SearchableOption) => {
    const current = (selectedValues || []) as SearchableOption[];
    const updatedValues = current.filter((v) => v.value !== valToRemove.value);
    setSelectedValues(updatedValues);
    onChange?.(updatedValues);
  };

  // Handle reset button click
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues(null);
    onChange?.(null);
  };

  // Sizing classes
  const sizeClasses: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Provide context to children
  const contextValue: SearchableSelectContextValue = {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    selectedValues,
    handleSelectionChange,
    multiple,
  };

  // Single-select display text
  const getSingleDisplayText = () => {
    if (!selectedValues) return placeholder;
    const singleVal = selectedValues as SearchableOption;
    return singleVal.label || singleVal.value || placeholder;
  };

  const ensureArray = (value: SearchableOption | SearchableOption[] | null): SearchableOption[] =>
    Array.isArray(value) ? value : value ? [value] : [];

  const multiSelected: SearchableOption[] = multiple ? ensureArray(selectedValues) : ensureArray(selectedValues)[0] ? [ensureArray(selectedValues)[0]] : [];

  return (
    <SearchableSelectContext.Provider value={contextValue}>
      <div className={`w-full ${className}`} ref={selectRef}>
        {/* Label */}
        {label && (
          <Label
            htmlFor={id}
            className={`${sizeClasses[size]} mb-2 block font-medium ${
              error ? 'text-red-700' : 'text-gray-900 dark:text-gray-200'
            }`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {/* Select container */}
        <div className="relative">
          {/* Main select display */}
          <button
            type="button"
            id={id}
            name={name}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? id : undefined}
            className={`
              block w-full rounded-lg border bg-white p-2.5 pr-8 text-left ${sizeClasses[size]}
              dark:bg-gray-700 dark:text-white
              ${
                error
                  ? 'border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
              }
              ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-600' : 'cursor-pointer'}
            `}
          >
            {/* Multi-select with tags */}
            {multiple ? (
              <div className={`flex ${wrap ? 'flex-wrap' : 'overflow-hidden truncate'} gap-1`}>
                {multiSelected.map((val: SearchableOption) => (
                  <span
                    key={val.value}
                    className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-200 dark:text-blue-800"
                  >
                    <span className="overflow-hidden whitespace-nowrap">
                      {val.label || val.value}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-1 text-blue-800 hover:text-blue-900 dark:text-blue-800 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(val);
                      }}
                    >
          <HiX className="h-3 w-3" />
        </span>
      </span>
                ))}
                {(Array.isArray(selectedValues) ? selectedValues : []).length === 0 && (
                  <span className="text-gray-400 dark:text-gray-400">{placeholder}</span>
                )}
              </div>
            ) : (
              // Single-select display
              <span
                className={
                  !selectedValues
                    ? 'text-gray-400 dark:text-gray-400'
                    : 'text-gray-700 dark:text-white'
                }
              >
    {getSingleDisplayText()}
  </span>
            )}


            {/* Dropdown arrow */}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiOutlineChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </span>
          </button>

          {/* Reset button (X) for single select */}
          {resetable && !multiple && selectedValues && !disabled && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <HiX className="h-4 w-4" />
            </button>
          )}

          {/* Dropdown menu */}
          {isOpen && (
            <div
              className="
                absolute z-10 mt-1 w-full
                overflow-auto rounded-md border border-gray-200 bg-white shadow-lg
                dark:border-gray-600 dark:bg-gray-700
              "
            >
              {children}
            </div>
          )}
        </div>

        {/* Helper text */}
        {helperText && (
          <p
            className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {helperText}
          </p>
        )}
      </div>
    </SearchableSelectContext.Provider>
  );
};

// ---------- Search Subcomponent ---------- //

interface SearchProps {
  placeholder?: string;
  onChange?: (term: string) => void;
  className?: string;
  disabled?: boolean;
  debounceMs?: number;
}

const Search: FC<SearchProps> = ({
  placeholder = 'Search...',
  onChange,
  className = '',
  disabled,
  debounceMs = 300,
}) => {
  const ctx = useContext(SearchableSelectContext);
  if (!ctx) return null;

  const { searchTerm, setSearchTerm } = ctx;
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for the onChange callback
    debounceTimeout.current = setTimeout(() => {
      onChange?.(value);
    }, debounceMs);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    onChange?.('');
  };

  return (
    <div className="border-b border-gray-200 p-2 dark:border-gray-600">
      <div className="relative">
        {/* Left search icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <HiSearch className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          disabled={disabled}
          className={`
            block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-9 text-sm text-gray-900
            focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white
            dark:focus:border-blue-500 dark:focus:ring-blue-500
            ${className}
            ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-600' : ''}
          `}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Right clear icon (only if there's a search term) */}
        {searchTerm && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
          >
            <HiX className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
          </button>
        )}
      </div>
    </div>
  );
};

// ---------- Option Subcomponent ---------- //

interface OptionProps {
  value: string | number;
  label: string | number;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

const Option: FC<OptionProps> = ({
  value,
  label,
  disabled = false,
  className = '',
  children,
}) => {
  const ctx = useContext(SearchableSelectContext);
  if (!ctx) return null;

  const { selectedValues, handleSelectionChange, multiple } = ctx;

  // Build option object using the label prop if provided
  const optionObj: SearchableOption = {
    value,
    label: label || (typeof children === 'string' ? children : undefined),
  };

  // Determine if this option is selected
  const isSelected = multiple
    ? Array.isArray(selectedValues) &&
      selectedValues.some((v) => v.value === value)
    : (selectedValues as SearchableOption)?.value === value;

  const handleClick = () => {
    if (!disabled) {
      handleSelectionChange(optionObj);
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
      className={`
        cursor-pointer px-4 py-2 text-sm
        hover:bg-gray-100 dark:hover:bg-gray-600
        ${isSelected ? 'bg-blue-100 text-blue-900 dark:bg-blue-600 dark:text-white' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      <div className="flex items-center">
        {multiple && (
          <Checkbox
            checked={isSelected}
            disabled={disabled}
            className="mr-2"
            onChange={() => handleClick()}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {children || label}
      </div>
    </div>
  );
};

// ---------- OptionGroup Subcomponent ---------- //

interface OptionGroupProps {
  label: string;
  className?: string;
  children?: ReactNode;
}

const OptionGroup: FC<OptionGroupProps> = ({
  label,
  className = '',
  children,
}) => {
  return (
    <div className={`py-1 ${className}`}>
      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        {label}
      </div>
      {children}
    </div>
  );
};

// ---------- NoResults Subcomponent ---------- //

interface NoResultsProps {
  children?: ReactNode;
  className?: string;
}

const NoResults: FC<NoResultsProps> = ({
  children = 'No results found',
  className = '',
}) => {
  return (
    <div
      className={`px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      {children}
    </div>
  );
};

// ---------- Loading Subcomponent ---------- //

interface LoadingProps {}

const Loading: FC<LoadingProps> = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
    </div>
  );
};

// ---------- Pagination Subcomponent ---------- //

interface PaginationProps {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  currentPage?: number;
  totalPages?: number;
}

const Pagination: FC<PaginationProps> = ({
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
  currentPage,
  totalPages,
}) => {
  // Detect if we're using cursor-based pagination (prev/next flags) or page-based (currentPage/totalPages)
  const isCursorPagination =
    onPreviousPage &&
    onNextPage &&
    (typeof hasPreviousPage !== 'undefined' ||
      typeof hasNextPage !== 'undefined');

  if (!isCursorPagination && (!currentPage || !totalPages)) {
    // If no pagination data, hide entirely
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 p-2 dark:border-gray-600">
      {isCursorPagination ? (
        <>
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500
                       hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700
                       dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500
                       hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700
                       dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            Next
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onPreviousPage}
            disabled={(currentPage ?? 1) <= 1}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500
                       hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700
                       dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={onNextPage}
            disabled={(currentPage ?? 1) >= (totalPages ?? 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-500
                       hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700
                       dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

// Attach subcomponents
SearchableSelect.Search = Search;
SearchableSelect.Option = Option;
SearchableSelect.OptionGroup = OptionGroup;
SearchableSelect.NoResults = NoResults;
SearchableSelect.Loading = Loading;
SearchableSelect.Pagination = Pagination;

export default SearchableSelect;
