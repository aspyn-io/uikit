import { format } from "date-fns";
import { Badge, Dropdown } from "flowbite-react";
import { HiOutlineCreditCard, HiOutlineDotsVertical } from "react-icons/hi";
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
  icon = <HiOutlineCreditCard size={24} />,
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
    <div className="border rounded-lg shadow-md bg-white p-6 flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          {showCustomerInfo && (
            <div className="text-lg font-semibold text-gray-900">
              {customerName}
            </div>
          )}
          {showCustomerInfo && (
            <div className="text-sm text-gray-500">{customerEmail}</div>
          )}
          <div className="text-gray-700 font-medium text-md mt-1">
            {product}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Created: {formattedDate}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-2xl font-bold">
            {totalAmount}{" "}
            <span className="text-lg text-gray-500">
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
            label={<HiOutlineDotsVertical size={20} />}
            className="overflow-hidden"
          >
            <Dropdown.Item onClick={onEdit}>Edit Subscription</Dropdown.Item>
            <Dropdown.Item onClick={onCancel}>
              Cancel Subscription
            </Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </div>
  );

  return routeTo ? <Link to={routeTo}>{CardContent}</Link> : CardContent;
};
