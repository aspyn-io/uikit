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
