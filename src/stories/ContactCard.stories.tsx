import { Meta, StoryObj } from "@storybook/react";
import ContactCard from "../components/ContactCard";

const meta: Meta<typeof ContactCard> = {
  title: "Cards/ContactCard",
  component: ContactCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ContactCard>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-80 mx-auto p-4">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <ContactCard {...args} />
    </Wrapper>
  ),
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
  render: (args) => (
    <Wrapper>
      <ContactCard {...args} />
    </Wrapper>
  ),
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
  render: (args) => (
    <Wrapper>
      <ContactCard {...args} />
    </Wrapper>
  ),
  args: {
    avatar: "https://i.pravatar.cc/300",
    name: "John Doe",
    address: "Austin",
    email: "john.doe@example.com",
    phone: "555-555-5555",
  },
};
