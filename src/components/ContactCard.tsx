import React from "react";
import { Card, Avatar, Button, Dropdown, Badge } from "flowbite-react";
import {
  HiDotsVertical,
  HiMail,
  HiPhone,
  HiLocationMarker,
} from "react-icons/hi";

interface ContactCardProps {
  avatar?: string;
  name: string;
  address?: string;
  actions?: { label: string; onClick: () => void }[];
  email: string;
  phone: string;
  showActionButtons?: boolean;
  role?: { label: string; color: string };
  status?: { label: string; color: string; icon?: React.ReactNode };
  linkTo?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  avatar,
  name,
  address,
  actions,
  email,
  phone,
  showActionButtons = true,
  role,
  status,
  linkTo,
}) => {
  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName[0]}${lastName[0]}`;
  };

  return (
    <Card href={linkTo ?? '#'} className="cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar
            img={avatar}
            rounded
            size="lg"
            alt={`${name}'s avatar`}
            placeholderInitials={avatar ? undefined : getInitials(name)}
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
            {role && (
              <Badge color={role.color} className="rounded-sm">
                {role.label}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {actions?.length && (
            <Dropdown
              label={<HiDotsVertical className="dark:text-white" />}
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
          {status && (
            <div className="flex items-center gap-2">
              {status.icon}
              <Badge
                color={status.color}
                className="rounded-sm flex items-center gap-1"
              >
                {status.label}
              </Badge>
            </div>
          )}
        </div>
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
      {showActionButtons && (
        <div className="mt-4 flex space-x-2">
          <a href={`tel:${phone}`} className="w-1/2">
            <Button color="gray" className="w-full">
              <HiPhone className="mr-2 h-5 w-5" /> Call
            </Button>
          </a>
          <a href={`mailto:${email}`} className="w-1/2">
            <Button color="gray" className="w-full">
              <HiMail className="mr-2 h-5 w-5" /> Mail
            </Button>
          </a>
        </div>
      )}
    </Card>
  );
};

export default ContactCard;
