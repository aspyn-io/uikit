import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useEffect } from "react";
import SearchableSelect, { SearchableOption } from "../components/SearchableSelect"; // adjust path as needed

const meta: Meta<typeof SearchableSelect> = {
  title: "forms/SearchableSelect",
  component: SearchableSelect,
  parameters: {
    layout: "padded",
    docs: {
      story: {
        height: "250px",
      }
    },
  },
  tags: ["autodocs"],
  args: {
    label: "Select an option",
    placeholder: "Choose an option",
    helperText: "Please select an option",
    multiple: false,
    error: false,
    wrap: true,
    resetable: false
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label text shown above the select.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text when nothing is selected.",
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple selections.",
    },
    resetable: {
      control: "boolean",
      description: "Shows an X button to clear the selection (single select only).",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed below the select.",
    },
    error: {
      control: "boolean",
      description: "Displays the select in an error state.",
    },
    wrap: {
      control: "boolean",
      description: "Displays truncated tags with overflow-hidden if set to false.",
    }
  },
};

export default meta;
type Story = StoryObj<typeof SearchableSelect>;

// Default Template for SearchableSelect
const SearchableSelectTemplate: React.FC<{ args: any }> = ({ args }) => {
  // For multi-select, the value is an array; for single select it's null by default.
  const [selected, setSelected] = useState<SearchableOption | SearchableOption[] | null>(args.multiple ? [] : null);

  return (
    <SearchableSelect
      {...args}
      value={selected}
      onChange={(val) => setSelected(val)}
    >
      <SearchableSelect.Search placeholder="Search options..." />
      <SearchableSelect.Option value="option1" label="Option 1" />
      <SearchableSelect.Option value="option2" label="Option 2" />
      <SearchableSelect.Option value="option3" label="Option 3" />
    </SearchableSelect>
  );
};

// Default single select story
export const Default: Story = {
  render: (args) => <SearchableSelectTemplate args={args} />,
  args: {
    label: "Select an option",
    placeholder: "Choose an option",
    multiple: false,
  },
};

// Multi-select story example
export const MultiSelect: Story = {
  render: (args) => <SearchableSelectTemplate args={args} />,
  args: {
    label: "Multi Select",
    placeholder: "Choose one or more options",
    multiple: true,
  },
};

// Resetable single select story
export const ResetableSelect: Story = {
  render: (args) => <SearchableSelectTemplate args={args} />,
  args: {
    label: "Resetable Select",
    placeholder: "Choose an option (can be cleared)",
    resetable: true,
    helperText: "Click the X button to clear your selection",
  },
};

// Grouped Options story example
export const GroupedOptions: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<SearchableOption | SearchableOption[] | null>(args.multiple ? [] : null);
    return (
      <SearchableSelect
        {...args}
        value={selected}
        onChange={(val) => setSelected(val)}
      >
        <SearchableSelect.Search placeholder="Search groups..." />
        <SearchableSelect.OptionGroup label="Group 1">
          <SearchableSelect.Option value="g1_option1" label="Group 1 Option 1" />
          <SearchableSelect.Option value="g1_option2" label="Group 1 Option 2" />
        </SearchableSelect.OptionGroup>
        <SearchableSelect.OptionGroup label="Group 2">
          <SearchableSelect.Option value="g2_option1" label="Group 2 Option 1" />
          <SearchableSelect.Option value="g2_option2" label="Group 2 Option 2" />
        </SearchableSelect.OptionGroup>
      </SearchableSelect>
    );
  },
  args: {
    label: "Grouped Options",
    placeholder: "Choose an option",
    multiple: false,
  },
};

// Demonstrating debounce options for the Search component
export const SearchDebouncing: Story = {
  render: () => {
    const [selected, setSelected] = useState<SearchableOption | null>(null);
    const [searchLogs, setSearchLogs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debounceMs, setDebounceMs] = useState<number>(300);
    
    // This simulates what would normally go to an API
    const handleSearch = (term: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setSearchLogs(prev => [`${timestamp}: Search for "${term}"`, ...prev].slice(0, 5));
      setSearchTerm(term);
    };
    
    const options = [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date" },
      { value: "elderberry", label: "Elderberry" },
      { value: "fig", label: "Fig" },
      { value: "grape", label: "Grape" }
    ];
    
    // Filter options based on search term
    const filteredOptions = options.filter(option => 
      searchTerm === "" || 
      option.label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Debounce Time (ms):</label>
          <div className="flex gap-4 items-center">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="100" 
              value={debounceMs} 
              onChange={(e) => setDebounceMs(Number(e.target.value))}
              className="w-64"
            />
            <span className="text-sm">{debounceMs}ms</span>
          </div>
        </div>
        
        <SearchableSelect
          label="Search with Debouncing"
          placeholder="Search fruits"
          helperText="Try typing quickly to see how debouncing affects search events"
          value={selected}
          onChange={(val) => setSelected(val as SearchableOption)}
        >
          <SearchableSelect.Search 
            placeholder="Type to search fruits..." 
            debounceMs={debounceMs}
            onChange={handleSearch}
          />
          {filteredOptions.map(option => (
            <SearchableSelect.Option 
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
          {filteredOptions.length === 0 && (
            <SearchableSelect.NoResults>No fruits match your search</SearchableSelect.NoResults>
          )}
        </SearchableSelect>
        
        <div className="mt-4 p-3 border border-gray-200 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <h3 className="text-sm font-medium mb-2">Search Event Log (debounce: {debounceMs}ms)</h3>
          {searchLogs.length > 0 ? (
            <ul className="text-xs space-y-1">
              {searchLogs.map((log, index) => (
                <li key={index}>{log}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">No search events yet. Try typing in the search box.</p>
          )}
        </div>
      </div>
    );
  },
  args: {
    // No custom args needed as we're handling everything in the component
  }
};

// Story demonstrating error state
export const WithError: Story = {
  render: (args) => <SearchableSelectTemplate args={args} />,
  args: {
    label: "Select an option",
    placeholder: "Choose an option",
    error: true,
    helperText: "There is an error with your selection",
  },
};

// Mock data for pagination story
const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
  { value: 'option6', label: 'Option 6' },
  { value: 'option7', label: 'Option 7' },
  { value: 'option8', label: 'Option 8' },
  { value: 'option9', label: 'Option 9' },
  { value: 'option10', label: 'Option 10' },
];

// Mock API call that returns paginated data
const fetchPaginatedOptions = async (page: number, perPage: number = 5) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      data: mockOptions.slice(start, end),
      totalPages: Math.ceil(mockOptions.length / perPage),
      currentPage: page
    };
  } catch (error) {
    console.error("Failed to fetch paginated options:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page
    };
  }
};

export const WithPagination: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<SearchableOption | SearchableOption[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [options, setOptions] = useState<SearchableOption[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    const loadPage = async (page: number) => {
      setLoading(true);
      try {
        const response = await fetchPaginatedOptions(page);
        setOptions(response.data);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } finally {
        setLoading(false);
      }
    };

    // Load initial page
    useEffect(() => {
      loadPage(1);
    }, []);

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        loadPage(currentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        loadPage(currentPage + 1);
      }
    };

    return (
      <SearchableSelect
        {...args}
        value={selected}
        onChange={(val) => setSelected(val)}
      >
        <SearchableSelect.Search placeholder="Search options..." />
        {loading && <SearchableSelect.Loading />}
        {!loading && options.map(option => (
          <SearchableSelect.Option
            key={option.value}
            value={option.value}
            label={String(option.label)}
          />
        ))}
        {!loading && options.length === 0 && (
          <SearchableSelect.NoResults>No options available</SearchableSelect.NoResults>
        )}
        <SearchableSelect.Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </SearchableSelect>
    );
  },
  args: {
    label: "Paginated Select",
    placeholder: "Select with pagination",
    helperText: "5 items per page, 10 total items"
  }
};

// Demonstrate loading state
export const Loading: Story = {
  render: (args) => (
    <SearchableSelect
      {...args}
      onChange={() => {}}
      value={null}
    >
      <SearchableSelect.Search placeholder="Search options..." />
      <SearchableSelect.Loading />
    </SearchableSelect>
  ),
  args: {
    label: "Loading State",
    placeholder: "Loading options...",
    helperText: "Showing the loading spinner while options are being fetched",
  }
};

// Demonstrate empty state
export const NoResults: Story = {
  render: (args) => (
    <SearchableSelect
      {...args}
      onChange={() => {}}
      value={null}
    >
      <SearchableSelect.Search placeholder="Search options..." />
      <SearchableSelect.NoResults>No matching options found</SearchableSelect.NoResults>
    </SearchableSelect>
  ),
  args: {
    label: "No Results State",
    placeholder: "No results available",
    helperText: "Showing the empty state when no options match search criteria",
  }
};
