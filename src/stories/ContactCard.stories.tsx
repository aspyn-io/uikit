import { Meta, StoryObj } from "@storybook/react";
import ContactCard from "../components/ContactCard";

const meta: Meta<typeof ContactCard> = {
  title: "Cards/ContactCard",
  component: ContactCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ContactCard>;

export const Default: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    actions: [
      { label: "Edit", onClick: () => console.log("Edit") },
      { label: "Delete", onClick: () => console.log("Delete") },
    ],
    email: "john.doe@example.com",
    phone: "555-555-5555",
  },
};

export const WithoutAddress: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    actions: [
      { label: "Edit", onClick: () => console.log("Edit") },
      { label: "Delete", onClick: () => console.log("Delete") },
    ],
    email: "john.doe@example.com",
    phone: "555-555-5555",
  },
};

export const WithoutActions: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: "John Doe",
    address: "Austin",
    actions: [
      { label: "Edit", onClick: () => console.log("Edit") },
      { label: "Delete", onClick: () => console.log("Delete") },
    ],
    email: "john.doe@example.com",
    phone: "555-555-5555",
  },
};

export const WithoutActionButtons: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    actions: [
      { label: "Edit", onClick: () => console.log("Edit") },
      { label: "Delete", onClick: () => console.log("Delete") },
    ],
    email: "john.doe@example.com",
    phone: "555-555-5555",
    showActionButtons: false,
  },
};
