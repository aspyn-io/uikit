import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SearchDropdown, SearchDropdownProps } from '../components/SearchDropdown';

const meta: Meta<typeof SearchDropdown> = {
  title: 'Forms/SearchDropdown',
  component: SearchDropdown,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SearchDropdown>;

const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

export const Default: Story = {
  render: (args) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleSelect = (item: string) => {
      setSelectedItem(item);
      alert(`Selected item: ${item}`);
    };

    return <SearchDropdown {...args} items={items} onSelect={handleSelect} />;
  },
  args: {
    items,
    onSearch: (query: string) => console.log(`Searching for: ${query}`),
  } as SearchDropdownProps,
};

export const AjaxSearch: Story = {
  render: (args) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<string[]>([]);

    const handleSelect = (item: string) => {
      setSelectedItem(item);
      alert(`Selected item: ${item}`);
    };

    const handleSearch = async (query: string) => {
      console.log(`Searching for: ${query}`);
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${query}&_limit=5`);
      const data = await response.json();
      setSearchResults(data.map((item: { title: string }) => item.title));
    };

    return <SearchDropdown {...args} items={searchResults} onSelect={handleSelect} onSearch={handleSearch} />;
  },
  args: {
    items: [],
    onSelect: (item: string) => alert(`Selected item: ${item}`),
  } as SearchDropdownProps,
};
