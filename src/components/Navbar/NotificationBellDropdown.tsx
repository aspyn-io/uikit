import type { FC } from 'react';
import { Dropdown } from 'flowbite-react';
import { HiBell, HiOutlineMail, HiOutlineUserAdd, HiOutlineHeart, HiOutlineChatAlt2, HiOutlineVideoCamera, HiEye } from 'react-icons/hi';

const NotificationBellDropdown: FC = function () {
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
          {/* Notification items */}
          {/* ...existing code... */}
        </div>
        <div className="block rounded-b-xl bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline">
          <a
            href="/notifications"
            className="inline-flex items-center gap-x-2"
          >
            <HiEye className="h-6 w-6" />
            <span>View all</span>
          </a>
        </div>
      </div>
    </Dropdown>
  );
};

export default NotificationBellDropdown;
