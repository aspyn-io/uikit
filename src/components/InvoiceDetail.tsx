import React from "react";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "gray";
    case "open":
      return "blue";
    case "paid":
      return "green";
    case "uncoolectible":
      return "red";
    case "void":
      return "yellow";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "open":
      return "Finalized";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

type Contact = {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  email: string;
};

interface InvoiceDetailProps {
  number: string;
  createdDate: string;
  dueDate: string;
  status: "draft" | "open" | "paid" | "uncollectible" | "void";
  invoicer?: Contact;
  customer: Contact;
  items: {
    id: string;
    description: string;
    quantity: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  amountShipping: number;
  total: number;
  className?: string;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  number,
  createdDate,
  dueDate,
  status,
  invoicer,
  customer,
  items,
  subtotal,
  tax,
  amountShipping,
  total,
  className,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6 ${className}`}
    >
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Invoice #{number}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Date: {new Date(createdDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Due date: {new Date(dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Badge
              color={getStatusColor(status)}
              className="rounded-md text-lg"
            >
              {getStatusText(status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Pay to:
            </h3>
            {invoicer && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  {invoicer.name}
                </p>
                {invoicer.address && (
                  <>
                    <p className="text-gray-600 dark:text-gray-400">
                      {invoicer.address.line1}
                    </p>
                    {invoicer.address.line2 && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {invoicer.address.line2}
                      </p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      {invoicer.address.city}, {invoicer.address.state}{" "}
                      {invoicer.address.postal_code}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {invoicer.address.country}
                    </p>
                  </>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {invoicer.email}
                </p>
              </>
            )}
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Invoice to:
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{customer.name}</p>
            {customer.address && (
              <>
                <p className="text-gray-600 dark:text-gray-400">
                  {customer.address.line1}
                </p>
                {customer.address.line2 && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {customer.address.line2}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {customer.address.city}, {customer.address.state}{" "}
                  {customer.address.postal_code}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {customer.address.country}
                </p>
              </>
            )}
            <p className="text-gray-600 dark:text-gray-400">{customer.email}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>Product Name</TableHeadCell>
              <TableHeadCell>Qty</TableHeadCell>
              <TableHeadCell>Price</TableHeadCell>
              <TableHeadCell>Total Price</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.amount, "USD")}</TableCell>
                <TableCell>
                  {formatCurrency(item.amount * item.quantity, "USD")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-6 border-t dark:border-gray-700">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Subtotal:</p>
            <p className="text-gray-600 dark:text-gray-400">Tax:</p>
            <p className="text-gray-600 dark:text-gray-400">
              Shipping estimate:
            </p>
          </div>
          <div>
            <p className="text-gray-900 dark:text-white">
              {formatCurrency(subtotal, "USD")}
            </p>
            <p className="text-gray-900 dark:text-white">
              {formatCurrency(tax, "USD")}
            </p>
            <p className="text-gray-900 dark:text-white">
              {formatCurrency(amountShipping, "USD")}
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            Order total:
          </h3>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {formatCurrency(total, "USD")}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
