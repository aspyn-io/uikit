import type { Meta, StoryObj } from "@storybook/react";
import Placeholder from "./Placeholder";

const meta: Meta<typeof Placeholder> = {
  title: "Components/Placeholder",
  component: Placeholder,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Placeholder>;

/** Default Placeholder */
export const Default: Story = {
  args: {
    text: "This is a placeholder",
  },
};

/** Large Placeholder */
export const Large: Story = {
  args: {
    text: "Large Placeholder",
    className: "text-xl p-6",
  },
};
