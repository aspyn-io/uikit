import { Meta, StoryObj } from "@storybook/react";
import ContactCard from "../components/ContactCard";
import { HiCheckCircle } from "react-icons/hi";

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
    linkTo: "https://google.com",
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
    linkTo: "https://google.com",
  },
};

export const WithoutActions: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
    linkTo: "https://google.com",
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
    linkTo: "https://google.com",
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
    linkTo: "https://google.com",
  },
};

export const WithRole: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
    role: { label: "Manager", color: "purple" },
    linkTo: "https://google.com",
  },
};

export const WithStatus: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
    status: {
      label: "Pending",
      color: "yellow",
      icon: <HiCheckCircle className="h-4 w-4" />,
    },
    actions: [
      { label: "Approve", onClick: () => console.log("Approve") },
      { label: "Reject", onClick: () => console.log("Reject") },
    ],
    linkTo: "https://google.com",
  },
};

export const WithoutLink: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
    status: {
      label: "Pending",
      color: "yellow",
      icon: <HiCheckCircle className="h-4 w-4" />,
    },
    actions: [
      { label: "Approve", onClick: () => console.log("Approve") },
      { label: "Reject", onClick: () => console.log("Reject") },
    ],
  },
};
