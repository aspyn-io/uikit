import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    } else {
      setFilteredItems(items.filter(item => item.toLowerCase().includes(query.toLowerCase())));
    }
  }, [query, items, onSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <Dropdown
      label={
        <div className="flex items-center">
          <HiSearch className="mr-2" />
          <span>Select Item</span>
        </div>
      }
    >
      <div className="p-2">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      <Dropdown.Divider />
      {filteredItems.map((item: string, index: number) => (
        <Dropdown.Item key={index} onClick={() => onSelect(item)}>
          {item}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export { SearchDropdown };
