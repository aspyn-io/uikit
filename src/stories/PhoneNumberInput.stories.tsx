import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import PhoneNumberInput from "@/components/PhoneNumberInput";

const meta: Meta<typeof PhoneNumberInput> = {
  title: "Forms/PhoneNumberInput",
  component: PhoneNumberInput,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PhoneNumberInput>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="h-[400px] p-4 flex flex-col gap-4">
        <PhoneNumberInput {...args} value={value} onChange={setValue} />

        <pre>Value: {JSON.stringify(value, null, 2)}</pre>
      </div>
    );
  },
  args: {
    placeholder: "Enter phone number",
  },
};
