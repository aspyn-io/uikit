import React from "react";
import { Avatar, Badge, Button, Dropdown, DropdownItem } from "flowbite-react";
import { Link } from "react-router-dom";
import { MoreVertical, Mail, Phone, MapPin } from "lucide-react";

interface ContactCardProps {
  avatar?: string;
  name: string;
  address?: string;
  actions?: { label: string; onClick: () => void }[];
  email: string;
  phone: string;
  showActionButtons?: boolean;
  status?: {
    label: string;
    color: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  to?: string;
  customButtons?: React.ReactNode;
  tags?: { label: string; color: string }[] | { label: string; color: string };
  className?: string;
}

export const ContactCard: React.FC<ContactCardProps> & {
  Button: React.FC<{
    to: string;
    icon: React.ReactNode;
    label: string;
    className?: string;
  }>;
} = ({
  avatar,
  name,
  address,
  actions,
  email,
  phone,
  showActionButtons = true,
  status,
  to,
  customButtons,
  tags,
  className = "",
}) => {
  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    if (!firstName || !lastName) return "N/A";
    return `${firstName[0]}${lastName[0]}`;
  };

  const renderTags = () => {
    if (Array.isArray(tags)) {
      return tags.map((tag, index) => (
        <Badge
          key={index}
          color={tag.color}
          className="rounded-sm inline-block"
        >
          {tag.label}
        </Badge>
      ));
    } else if (tags) {
      return (
        <Badge color={tags.color} className="rounded-sm inline-block">
          {tags.label}
        </Badge>
      );
    }
    return null;
  };

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 ${className}`}
    >
      <div
        className={`p-4 ${
          to ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""
        }`}
        onClick={(e) => {
          if (to && !(e.target as HTMLElement).closest(".dropdown")) {
            window.location.href = to;
          }
        }}
      >
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
                  <MapPin className="text-gray-500 dark:text-gray-400 h-4 w-4" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {address}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-1">{renderTags()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge
                icon={status.icon}
                color={status.color}
                className="rounded-md flex items-center gap-1 px-3"
              >
                {status.label}
              </Badge>
            )}
            {actions?.length && (
              <Dropdown
                label={
                  <div className="dropdown p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <MoreVertical className="text-gray-500 dark:text-gray-400" />
                  </div>
                }
                inline
                arrowIcon={false}
                placement="left-start"
              >
                {actions.map((action, index) => (
                  <DropdownItem key={index} onClick={action.onClick}>
                    {action.label}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Mail className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400 underline">
              {email}
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Phone className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {phone}
            </span>
          </div>
        </div>
      </div>
      {showActionButtons && (
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          {customButtons ? (
            customButtons
          ) : (
            <>
              <ContactCard.Button
                to={`tel:${phone}`}
                icon={<Phone className="mr-2 h-5 w-5" />}
                label="Call"
                className="border-r border-gray-200 dark:border-gray-700"
              />
              <ContactCard.Button
                to={`mailto:${email}`}
                icon={<Mail className="mr-2 h-5 w-5" />}
                label="Mail"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

ContactCard.Button = ({ to, icon, label, className }) => (
  <Link to={to} className={`w-1/2 ${className ? className : ""}`}>
    <Button
      color="gray"
      className="w-full h-full flex items-center justify-center border-none rounded-none py-3"
    >
      {icon} {label}
    </Button>
  </Link>
);

export default ContactCard;
