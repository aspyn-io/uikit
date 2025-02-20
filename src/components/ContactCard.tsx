import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
} from 'flowbite-react';
import {
  HiDotsVertical,
  HiMail,
  HiPhone,
  HiLocationMarker
} from 'react-icons/hi';

interface ContactCardProps {
  avatar?: string;
  name: string;
  address?: string;
  actions?: { label: string; onClick: () => void }[];
  email: string;
  phone: string;
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  avatar,
  name,
  address,
  actions,
  email,
  phone,
  className,
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar
            img={avatar || 'https://placehold.co/500x500?text=?'}
            rounded
            size="lg"
            alt={`${name}'s avatar`}
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {name}
            </h2>
            {address && (
              <div className="flex items-center space-x-2">
                <HiLocationMarker className="text-gray-500 dark:text-gray-400 h-4 w-4" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {address}
                </span>
              </div>
            )}
          </div>
        </div>
        {actions?.length && (
          <Dropdown
            label={<HiDotsVertical />}
            inline
            arrowIcon={false}
            placement="left-start"
          >
            {actions.map((action, index) => (
              <Dropdown.Item key={index} onClick={action.onClick}>
                {action.label}
              </Dropdown.Item>
            ))}
          </Dropdown>
        )}
        
      </div>
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <HiMail className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400 underline">
            {email}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <HiPhone className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {phone}
          </span>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <a
          href={`tel:${phone}`}
          className="w-1/2"
        >
          <Button
            color="gray"
            className="w-full"
          >
            <HiPhone className="mr-2 h-5 w-5" /> Call
          </Button>
        </a>
        <a href={`mailto:${email}`} className="w-1/2">
          <Button
            color="gray"
            className="w-full"
          >
            <HiMail className="mr-2 h-5 w-5" /> Mail
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
