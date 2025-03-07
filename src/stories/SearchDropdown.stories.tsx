import { Meta, StoryObj } from "@storybook/react";
import SearchDropdown, { SearchDropdownProps } from "../components/SearchDropdown";
import { useState } from "react";
import { NavbarProvider } from "../context/NavbarContext";

/**
 * The `SearchDropdown` component allows users to search and select items from a dropdown list.
 *
 * ```tsx
 * import SearchDropdown from './SearchDropdown';
 *
 * const MySearchDropdown = () => {
 *   const items = ["Item 1", "Item 2", "Item 3"];
 *   const handleSearch = (query) => { ... };
 *   const handleSelect = (item) => { ... };
 *
 *   return (
 *     <SearchDropdown items={items} onSearch={handleSearch} onSelect={handleSelect} />
 *   );
 * };
 * ```
 */

const meta: Meta<typeof SearchDropdown> = {
  title: "components/SearchDropdown",
  component: SearchDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NavbarProvider>
        <div className="flex justify-center">
          <Story />
        </div>
      </NavbarProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SearchDropdown>;

const Template: Story = (args: SearchDropdownProps) => {
  const [items, setItems] = useState(args.items);

  const handleSearch = (query: string) => {
    // Simulate search logic
    setItems(args.items.filter((item: string) => item.toLowerCase().includes(query.toLowerCase())));
  };

  const handleSelect = (item: string) => {
    alert(`Selected: ${item}`);
  };

  return <SearchDropdown {...args} items={items} onSearch={handleSearch} onSelect={handleSelect} />;
};

/**
 * Default Example
 */
export const Default: Story = Template.bind({});
Default.args = {
  items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
};
