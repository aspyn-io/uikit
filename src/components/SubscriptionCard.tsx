import { format } from "date-fns";
import { Badge, Dropdown, DropdownItem } from "flowbite-react";
import { CreditCard, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

import { ReactNode } from "react";

interface SubscriptionCardProps {
  id: string;
  status: string;
  product: string;
  createdAt: string | Date;
  billingType: string;
  totalAmount: string;
  onCancel?: () => void;
  onEdit?: () => void;
  editable?: boolean;
  showCustomerInfo?: boolean;
  customerEmail?: string;
  customerName?: string;
  icon?: ReactNode;
  routeTo?: string;
}

export const SubscriptionCard = ({
  id,
  status,
  product,
  createdAt,
  billingType,
  totalAmount,
  onCancel,
  onEdit,
  editable = false,
  showCustomerInfo = false,
  customerEmail,
  customerName,
  icon = <CreditCard size={24} />,
  routeTo,
}: SubscriptionCardProps) => {
  const formattedDate = format(new Date(createdAt), "MMM d, yyyy h:mm a");

  const formattedBillingType =
    billingType.toLowerCase() === "monthly"
      ? "/mo"
      : billingType.toLowerCase() === "yearly"
      ? "/yr"
      : "";

  const CardContent = (
    <div className="border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 p-6 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          {showCustomerInfo && (
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {customerName}
            </div>
          )}
          {showCustomerInfo && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {customerEmail}
            </div>
          )}
          <div className="text-gray-700 dark:text-gray-200 font-medium text-md mt-1">
            {product}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Created: {formattedDate}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-2xl font-bold dark:text-white">
            {totalAmount}{" "}
            <span className="text-lg text-gray-500 dark:text-gray-400">
              {formattedBillingType}
            </span>
          </div>
          <Badge color="success" className="inline-block capitalize mt-1">
            {status}
          </Badge>
        </div>
        {editable && (
          <Dropdown
            inline
            arrowIcon={false}
            label={<MoreVertical size={20} />}
            className="overflow-hidden"
          >
            <DropdownItem onClick={onEdit}>Edit Subscription</DropdownItem>
            <DropdownItem onClick={onCancel}>Cancel Subscription</DropdownItem>
          </Dropdown>
        )}
      </div>
    </div>
  );

  return routeTo ? <Link to={routeTo}>{CardContent}</Link> : CardContent;
};
