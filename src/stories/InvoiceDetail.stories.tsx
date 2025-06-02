import { Meta, StoryObj } from "@storybook/react-vite";
import InvoiceDetail from "../components/InvoiceDetail";

const meta: Meta<typeof InvoiceDetail> = {
  title: "Components/InvoiceDetail",
  component: InvoiceDetail,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof InvoiceDetail>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-4xl mx-auto p-4">{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Wrapper>
      <InvoiceDetail {...args} />
    </Wrapper>
  ),
  args: {
    number: "INV-93763",
    createdDate: "2025-02-21T14:11:09.000000Z",
    dueDate: "2025-03-19T11:48:27.000000Z",
    status: 'draft',
    invoicer: {
      name: "John Doe",
      address: {
        line1: "2660 Donnie Wall",
        line2: "",
        city: "South Nathaniel",
        state: "OR",
        postal_code: "19875-3953",
        country: "LR"
      },
      email: "john.doe@example.com"
    },
    customer: {
      name: "Candida Durgan",
      address: {
        line1: "2660 Donnie Wall",
        line2: "",
        city: "South Nathaniel",
        state: "OR",
        postal_code: "19875-3953",
        country: "LR"
      },
      email: "karli54@example.net"
    },
    items: [
      {
        id: "0",
        description: "Non sint numquam voluptatem in soluta aut.",
        quantity: 6,
        amount: 9937
      },
    ],
    subtotal: 29403,
    tax: 2940,
    amountShipping: 0,
    total: 32343
  },
};
