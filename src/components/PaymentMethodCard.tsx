import React, { ReactNode } from "react";

interface PaymentMethodCard {
  cardType?: string;
  cardIcon?: ReactNode;
  cardNumber?: string;
  expiryDate?: string;
  lastUpdated?: string;
  onEdit?: () => void;
  buttonText?: string;
  children?: ReactNode;
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
  onEdit,
  buttonText = "Edit",
  children,
}: PaymentMethodCard) => {
  return (
    <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-center sm:justify-between">
      <h4 className="sr-only">{cardType}</h4>
      <div className="sm:flex sm:items-start">
        {cardIcon}
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">
            Ending with {cardNumber}
          </div>
          <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
            <div>Expires {expiryDate}</div>
            <span className="hidden sm:mx-2 sm:inline" aria-hidden="true">
              &middot;
            </span>
            <div className="mt-1 sm:mt-0">Last updated on {lastUpdated}</div>
          </div>
          {children}
        </div>
      </div>
      {onEdit && (
        <div className="mt-4 sm:mt-0 sm:flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
