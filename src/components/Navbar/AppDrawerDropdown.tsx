import type { FC } from 'react';
import { Dropdown } from 'flowbite-react';
import { HiViewGrid, HiPlus } from 'react-icons/hi';

const AppDrawerDropdown: FC = function () {
  const handleAppSwitch = (path: string) => {
    window.location.href = path;
  };

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <span className="mr-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
        </span>
      }
    >
      <div className="block rounded-t-lg border-b bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-white">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        {/* Replace with actual app links */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleAppSwitch('/app1');
          }}
          className="block border rounded-md p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
        >
          <div className="flex flex-col items-center">
            <HiViewGrid className="mb-1 h-7 w-7 text-gray-500 dark:text-white" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              App 1
            </div>
          </div>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleAppSwitch('/app2');
          }}
          className="block border rounded-md p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
        >
          <div className="flex flex-col items-center">
            <HiViewGrid className="mb-1 h-7 w-7 text-gray-500 dark:text-white" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              App 2
            </div>
          </div>
        </a>
        <a
          href="/admin/products"
          className="block border rounded-md p-4 text-center hover:bg-gray-300 dark:hover:bg-gray-900 dark:border-gray-600 bg-gray-200 dark:bg-gray-800"
        >
          <div className="flex flex-col items-center">
            <HiPlus className="mb-1 h-7 w-7 text-gray-500 dark:text-white" />
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Explore Products
            </div>
          </div>
        </a>
      </div>
    </Dropdown>
  );
};

export default AppDrawerDropdown;
