import React, { useState, useEffect, useRef } from 'react';
import { HiSearch } from 'react-icons/hi';
import { Dropdown } from 'flowbite-react';

export interface SearchDropdownProps {
  items: string[];
  onSearch?: (query: string) => void;
  onSelect: (item: string) => void;
  buttonText?: string;
  buttonColor?: string;
  buttonBgColor?: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ items, onSearch, onSelect, buttonText = "Select Item", buttonColor = "white", buttonBgColor = "#4f4f4f" }) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    }
    setFilteredItems(items.filter(item => item.toLowerCase().includes(query.toLowerCase())));
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
          <HiSearch className="mr-2" />
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

      <Dropdown.Divider />
      <div className="max-h-60 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <Dropdown.Item aria-readonly disabled>No items found</Dropdown.Item>
        ) : (
          filteredItems.map((item: string, index: number) => (
            <Dropdown.Item key={index} onClick={() => onSelect(item)}>
              {item}
            </Dropdown.Item>
          ))
        )}
      </div>
    </Dropdown>
  );
};

export { SearchDropdown };
