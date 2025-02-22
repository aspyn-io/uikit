import { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "flowbite-react";
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
  },
};

export const Clickable: Story = {
  args: {
    ...Default.args,
    onClick: () => console.log("Card clicked"),
  },
};

export const WithDrawer: Story = {
  args: {
    ...Default.args,
    drawerContent: (
      <>
        <Dropdown.Item onClick={() => console.log("Edit")}>
          Edit payment method
        </Dropdown.Item>
        <Dropdown.Item onClick={() => console.log("Delete")}>
          Delete payment method
        </Dropdown.Item>
      </>
    ),
  },
};

export const ClickableWithDrawer: Story = {
  args: {
    ...Default.args,
    onClick: () => console.log("Card clicked"),
    drawerContent: (
      <>
        <Dropdown.Item onClick={() => console.log("Make default")}>
          Set as default
        </Dropdown.Item>
        <Dropdown.Item onClick={() => console.log("Delete")}>
          Delete payment method
        </Dropdown.Item>
      </>
    ),
  },
};

export const WithMetadata: Story = {
  args: {
    ...Default.args,
    children: (
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Default payment method
      </div>
    ),
  },
};
