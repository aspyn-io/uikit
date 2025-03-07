import React, { useState ,useEffect} from 'react';
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
    buttonText: 'Select Item',
    buttonColor: 'white',
    buttonBgColor: '#4f4f4f',
  } as SearchDropdownProps,
};

export const CustomSearch: Story = {
  render: (args) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      const delayDebounceFn = setTimeout(async () => {
        console.log(`Searching for: ${query}`);
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${query}`);
          const data = await response.json();
          setSearchResults(data.map((item: { title: string }) => item.title));
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }, 300); 

      return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelect = (item: string) => {
      setSelectedItem(item);
      alert(`Selected item: ${item}`);
    };

    return (
      <SearchDropdown 
        {...args} 
        items={searchResults} 
        onSelect={handleSelect} 
        onSearch={setQuery} 
      />
    );
  },
  args: {
    items: [],
    onSelect: (item: string) => alert(`Selected item: ${item}`),
    buttonText: 'Custom Search',
    buttonColor: 'white',
    buttonBgColor: '#4f4f4f',
  } as SearchDropdownProps,
};

