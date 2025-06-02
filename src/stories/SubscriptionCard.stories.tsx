import * as React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { SubscriptionCard } from "../components/SubscriptionCard";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { BrowserRouter } from "react-router-dom";

const meta: Meta<typeof SubscriptionCard> = {
  title: "Cards/SubscriptionCard",
  component: SubscriptionCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubscriptionCard>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-4xl mx-auto p-4">{children}</div>
);

const subscriptionData = {
  id: "sub_123456",
  status: "Active",
  product: "Basic Pest Control",
  createdAt: new Date(),
  billingType: "Monthly",
  totalAmount: "$123.00",
};

// Default Story
export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
  },
};

// Editable Subscription
export const Editable: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    editable: true,
    onEdit: () => console.log("Editing Subscription"),
    onCancel: () => console.log("Canceling Subscription"),
  },
};

// Subscription with Custom Icon
export const WithCustomIcon: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    icon: <HiOutlineReceiptRefund size={24} />,
  },
};

// Subscription with Customer Info
export const WithCustomerInfo: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    showCustomerInfo: true,
    customerName: "Richard Hendricks",
    customerEmail: "richard@example.com",
  },
};

// Canceled Subscription
export const Canceled: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    status: "Canceled",
  },
};

// Yearly Subscription
export const YearlySubscription: Story = {
  render: (args) => (
    <Wrapper>
      <SubscriptionCard {...args} />
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    billingType: "Yearly",
    totalAmount: "$1,476.00",
  },
};

// Clickable Subscription (Navigates)
export const Clickable: Story = {
  render: (args) => (
    <Wrapper>
      <BrowserRouter>
        <SubscriptionCard {...args} />
      </BrowserRouter>
    </Wrapper>
  ),
  args: {
    ...subscriptionData,
    routeTo: "/subscriptions/sub_123456",
  },
};
