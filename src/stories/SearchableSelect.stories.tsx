import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import SearchableSelect from "../components/SearchableSelect"; // adjust path as needed

const meta: Meta<typeof SearchableSelect> = {
  title: "forms/SearchableSelect",
  component: SearchableSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Select an option",
    placeholder: "Choose an option",
    helperText: "Please select an option",
    multiple: false,
    error: false,
    wrap: true
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
  const [selected, setSelected] = useState(args.multiple ? [] : null);

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

// Grouped Options story example
export const GroupedOptions: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(null);
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
