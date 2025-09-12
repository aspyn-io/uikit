import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";

export interface SearchDropdownProps {
  items: string[];
  onSearch?: (query: string) => void;
  onSelect: (item: string) => void;
  buttonText?: string;
  buttonColor?: string;
  buttonBgColor?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  items,
  onSearch,
  onSelect,
  buttonText = "Select Item",
  buttonColor = "white",
  buttonBgColor = "#4f4f4f",
}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
    setFilteredItems(
      items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, items, onSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <Dropdown
      style={{ backgroundColor: `${buttonBgColor}`, color: `${buttonColor}` }}
      label={
        <button className="flex items-center">
          <Search className="mr-2" />
          <span>{buttonText}</span>
        </button>
      }
    >
      <div className="p-3" onKeyDown={handleKeyDown}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <DropdownDivider />
      <div className="max-h-60 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <DropdownItem aria-readonly disabled>
            No items found
          </DropdownItem>
        ) : (
          filteredItems.map((item: string, index: number) => (
            <DropdownItem key={index} onClick={() => onSelect(item)}>
              {item}
            </DropdownItem>
          ))
        )}
      </div>
    </Dropdown>
  );
};

export { SearchDropdown };
