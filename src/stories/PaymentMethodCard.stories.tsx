import { Meta, StoryObj } from "@storybook/react";
import PaymentMethodCard from "../components/PaymentMethodCard";

const meta: Meta<typeof PaymentMethodCard> = {
  title: "Cards/PaymentMethodCard",
  component: PaymentMethodCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PaymentMethodCard>;

export const Default: Story = {
  args: {
    cardType: "Visa",
    cardNumber: "4242",
    expiryDate: "12/20",
    lastUpdated: "22 Aug 2017",
    onEdit: () => console.log("Edit clicked"),
  },
};

export const WithoutEditButton: Story = {
  args: {
    cardType: "Visa",
    cardNumber: "9876",
    expiryDate: "03/24",
    lastUpdated: "10 Jan 2024",
  },
};

export const WithAdditionalContent: Story = {
  args: {
    cardType: "Visa",
    cardNumber: "1234",
    expiryDate: "06/25",
    lastUpdated: "1 Mar 2024",
    onEdit: () => console.log("Edit clicked"),
    children: (
      <div className="mt-2 text-sm text-gray-500">
        Primary payment method • Used for all subscriptions
      </div>
    ),
  },
};

export const WithCustomButtonText: Story = {
  args: {
    cardType: "Visa",
    cardNumber: "3456",
    expiryDate: "12/26",
    lastUpdated: "5 Mar 2024",
    onEdit: () => console.log("Edit clicked"),
    buttonText: "Update Card",
  },
};
