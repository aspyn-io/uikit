import { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import ContactCard from "../components/ContactCard";
import { MessageCircle, User, Bell, Settings } from "lucide-react";
import { CheckCircle } from "lucide-react";

const meta: Meta<typeof ContactCard> = {
  title: "Cards/ContactCard",
  component: ContactCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
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
    to: "#",
    tags: [
      { label: "VIP", color: "red" },
      { label: "New", color: "green" },
    ],
    status: {
      label: "Active",
      color: "green",
      icon: () => <CheckCircle className="h-4 w-4" />,
    },
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
      icon: () => <CheckCircle className="h-4 w-4" />,
    },
    actions: [
      { label: "Approve", onClick: () => console.log("Approve") },
      { label: "Reject", onClick: () => console.log("Reject") },
    ],
  },
};

export const CustomButtons: Story = {
  args: {
    ...Default.args,
    customButtons: (
      <>
        <ContactCard.Button
          to="#"
          icon={<MessageCircle className="mr-2 h-5 w-5" />}
          label="Chat"
        />
        <ContactCard.Button
          to="#"
          icon={<User className="mr-2 h-5 w-5" />}
          label="Profile"
        />
        <ContactCard.Button
          to="#"
          icon={<Bell className="mr-2 h-5 w-5" />}
          label="Notifications"
        />
        <ContactCard.Button
          to="#"
          icon={<Settings className="mr-2 h-5 w-5" />}
          label="Settings"
        />
      </>
    ),
  },
};

export const WithRoleAsTag: Story = {
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
    tags: [
      { label: "Manager", color: "purple" },
      { label: "VIP", color: "red" },
    ],
  },
};
