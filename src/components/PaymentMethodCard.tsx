import React, { ReactNode } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Dropdown } from "flowbite-react";

interface PaymentMethodCard {
  cardType?: string;
  cardIcon?: ReactNode;
  cardNumber?: string;
  expiryDate?: string;
  lastUpdated?: string;
  children?: ReactNode;
  onClick?: () => void;
  drawerContent?: ReactNode;
}

const UnknownCardIcon = () => (
  <svg
    className="h-8 w-auto sm:h-6 sm:shrink-0"
    viewBox="0 0 36 24"
    aria-hidden="true"
  >
    <rect width="36" height="24" fill="#697386" rx="4" />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M5 14.5v-5c0-.828.672-1.5 1.5-1.5h23c.828 0 1.5.672 1.5 1.5v5c0 .828-.672 1.5-1.5 1.5h-23c-.828 0-1.5-.672-1.5-1.5zm3-3.5c0-.552.448-1 1-1h3c.552 0 1 .448 1 1s-.448 1-1 1h-3c-.552 0-1-.448-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const PaymentMethodCard = ({
  cardType = "Card",
  cardIcon = <UnknownCardIcon />,
  cardNumber = "4242",
  expiryDate = "12/20",
  lastUpdated = "22 Aug 2017",
  children,
  onClick,
  drawerContent,
}: PaymentMethodCard) => {
  const CardContent = (
    <>
      <div className="sm:flex sm:items-start">
        {cardIcon}
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Ending with {cardNumber}
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:flex sm:items-center">
            <div>Expires {expiryDate}</div>
            <span className="hidden sm:mx-2 sm:inline" aria-hidden="true">
              &middot;
            </span>
            <div className="mt-1 sm:mt-0">Last updated on {lastUpdated}</div>
          </div>
          {children}
        </div>
      </div>
      {drawerContent && (
        <div
          className="mt-4 sm:mt-0 sm:flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            inline
            arrowIcon={false}
            label={
              <HiDotsVertical className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            }
          >
            {drawerContent}
          </Dropdown>
        </div>
      )}
    </>
  );

  const className = `border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 px-6 py-5 sm:flex sm:items-center sm:justify-between${
    onClick
      ? " cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      : ""
  }`;

  return (
    <div className={className} onClick={onClick}>
      {CardContent}
    </div>
  );
};

export default PaymentMethodCard;
