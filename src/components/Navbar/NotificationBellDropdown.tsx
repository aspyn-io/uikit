import type { FC } from "react";
import { Dropdown } from "flowbite-react";
import { HiBell } from "react-icons/hi";
import NotificationItemListing, { NotificationItem } from "./NotificationItem";

interface NotificationBellDropdownProps {
  notifications: NotificationItem[];
  onViewAll?: () => void;
}

const NotificationBellDropdown: FC<NotificationBellDropdownProps> = ({ notifications, onViewAll }) => {
  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Notifications</span>
          <HiBell className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white " />
        </span>
      }
    >
      <div className="max-w-[24rem]">
        <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          Notifications
        </div>
        <div>
          {notifications.map((notification, index) => (
            <NotificationItemListing
              key={index}
              avatar={notification.avatar}
              username={notification.username}
              content={notification.content}
              datetime={notification.datetime}
              onClick={notification.onClick}
            />
          ))}
        </div>
        <a
          href="#"
          className="block rounded-b-xl bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
          onClick={onViewAll}
        >
          <div className="inline-flex items-center gap-x-2">
            <span>View all</span>
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

export default NotificationBellDropdown;
