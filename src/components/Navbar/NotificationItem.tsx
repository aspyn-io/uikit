import type { FC } from "react";

export interface NotificationItem {
  avatar: string;
  username: string;
  content: string;
  datetime: string;
  onClick?: () => void;
}

const NotificationItemListing: FC<NotificationItem> = ({ avatar, username, content, datetime, onClick }) => {
  return (
    <a
      href="#"
      className="flex border-b py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
      onClick={onClick}
    >
      <div className="shrink-0">
        <img alt="" src={avatar} className="h-11 w-11 rounded-full" />
        <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700">
        </div>
      </div>
      <div className="w-full pl-3">
        <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">
            {username}
          </span>
          &nbsp;{content}
        </div>
        <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
          {datetime}
        </div>
      </div>
    </a>
  );
};

export default NotificationItemListing;
