import { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "flowbite-react";
import PaymentMethodCard from "../components/PaymentMethodCard";

const meta: Meta<typeof PaymentMethodCard> = {
  title: "Cards/PaymentMethodCard",
  component: PaymentMethodCard,
  tags: ["autodocs"],
  argTypes: {
    cardIcon: {
      description: "Custom icon component to display for the payment method",
      control: "none",
    },
    cardNumber: {
      description: "Last 4 digits of the card number",
      control: "text",
    },
    expiryDate: {
      description: "Expiration date of the card (MM/YY)",
      control: "text",
    },
    lastUpdated: {
      description: "Date when the card was last updated",
      control: "text",
    },
    children: {
      description: "Additional content to display below card details",
      control: "none",
    },
    onClick: {
      description: "Handler for when the card is clicked",
      control: "none",
    },
    drawerContent: {
      description: "Content to show in the dropdown menu",
      control: "none",
    },
  },
};

export default meta;

type Story = StoryObj<typeof PaymentMethodCard>;

// Card Icons for examples
const VisaIcon = () => (
  <svg className="h-8 w-auto sm:h-6" viewBox="0 0 36 24" aria-hidden="true">
    <rect width="36" height="24" fill="#1434CB" rx="4" />
    <path
      fill="#fff"
      d="M13.932 8.062h-2.494L8.514 15.93h2.494l2.924-7.868zM24.378 8.062l-1.993 5.527-.243-1.173-.723-3.48c-.121-.487-.487-.866-1.017-.874h-3.28l-.037.218c.672.146 1.271.36 1.884.632l1.59 6.078h2.517l3.664-7.868h-2.362zm3.156 7.868h2.32l-2.024-7.868h-2.048c-.462 0-.851.267-1.024.681l-3.37 7.187h2.517l.462-1.292h2.884l.243 1.292h.04zm-2.466-3.029l1.188-3.273.681 3.273h-1.869zM15.816 8.062l-1.993 5.077-.584-2.929-.389-1.857C12.729 7.866 12.363 7.487 11.833 7.479H8.553l-.037.218c1.066.243 2.011.633 2.517 1.049l2.132 7.187h2.542l3.687-7.871h-2.578z"
    />
  </svg>
);

const MastercardIcon = () => (
  <svg className="h-8 w-auto sm:h-6" viewBox="0 0 36 24" aria-hidden="true">
    <rect width="36" height="24" fill="#252525" rx="4" />
    <circle cx="15" cy="12" r="6" fill="#eb001b" />
    <circle cx="21" cy="12" r="6" fill="#f79e1b" />
    <path
      d="M18 12a6 6 0 01-3 5.196A6 6 0 0115 6.804a6 6 0 010 10.392z"
      fill="#ff5f00"
    />
  </svg>
);

const commonDrawerContent = (
  <>
    <Dropdown.Item onClick={() => console.log("Edit")}>
      Edit payment method
    </Dropdown.Item>
    <Dropdown.Item onClick={() => console.log("Delete")}>
      Delete payment method
    </Dropdown.Item>
  </>
);

// Basic Examples
export const Default: Story = {
  args: {
    cardNumber: "4242",
    expiryDate: "12/24",
    lastUpdated: "Mar 15, 2024",
  },
};

export const WithVisa: Story = {
  args: {
    ...Default.args,
    cardIcon: <VisaIcon />,
  },
};

export const WithMastercard: Story = {
  args: {
    ...Default.args,
    cardNumber: "5555",
    cardIcon: <MastercardIcon />,
  },
};

// Interaction Examples
export const Clickable: Story = {
  args: {
    ...WithVisa.args,
    onClick: () => console.log("Card clicked"),
  },
};

export const WithDrawer: Story = {
  args: {
    ...WithVisa.args,
    drawerContent: commonDrawerContent,
  },
};

export const ClickableWithDrawer: Story = {
  args: {
    ...WithVisa.args,
    onClick: () => console.log("Card clicked"),
    drawerContent: commonDrawerContent,
  },
};

// Content Examples
export const WithAdditionalContent: Story = {
  args: {
    ...WithVisa.args,
    children: (
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Primary payment method • Used for all subscriptions
      </div>
    ),
  },
};

export const FullFeatured: Story = {
  args: {
    cardIcon: <VisaIcon />,
    cardNumber: "4242",
    expiryDate: "12/24",
    lastUpdated: "Mar 15, 2024",
    onClick: () => console.log("Card clicked"),
    drawerContent: commonDrawerContent,
    children: (
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Default payment method
      </div>
    ),
  },
};
