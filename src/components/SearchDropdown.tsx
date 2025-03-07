import React, { useState, useEffect, useRef } from 'react';
import { HiSearch } from 'react-icons/hi';
import { Dropdown } from 'flowbite-react';

export interface SearchDropdownProps {
  items: string[];
  onSearch?: (query: string) => void;
  onSelect: (item: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ items, onSearch, onSelect }) => {
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
      label={
        <button   className="flex items-center">
          <HiSearch className="mr-2" />
          <span>Select Item</span>
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
      {filteredItems.length === 0 ? (
        <Dropdown.Item aria-readonly disabled>No items found</Dropdown.Item>
      ) : (
        filteredItems.map((item: string, index: number) => (
          <Dropdown.Item key={index} onClick={() => onSelect(item)}>
            {item}
          </Dropdown.Item>
        ))
      )}
    </Dropdown>
  );
};

export { SearchDropdown };
