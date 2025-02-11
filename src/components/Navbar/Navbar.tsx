import type { FC } from 'react';
import {
  DarkThemeToggle,
  Navbar as FlowbiteNavbar,
  Tooltip,
} from 'flowbite-react';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import NotificationBellDropdown from './NotificationBellDropdown';
import AppDrawerDropdown from './AppDrawerDropdown';
import UserDropdown from './UserDropdown';

const Navbar: FC = function () {
  const appName = "Aspyn"; // Replace with actual app name if needed
  const logoLink = "/"; // Replace with actual logo link if needed
  const isPageWithSidebar = true; // Replace with actual condition if needed
  const isOpenOnSmallScreens = false; // Replace with actual state if needed

  return (
    <FlowbiteNavbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                className="cursor-pointer rounded mr-2 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <a href="/">
              <Tooltip content="Return to Home">
                <span className="mr-3 h-6 sm:h-8">Logo</span> {/* Replace with actual logo if needed */}
              </Tooltip>
            </a>
            <FlowbiteNavbar.Brand href={logoLink}>
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white border-l pl-3 border-gray-200 dark:border-gray-600 dark:border-">
                {appName}
              </span>
            </FlowbiteNavbar.Brand>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <NotificationBellDropdown />
              <DarkThemeToggle />
              <AppDrawerDropdown />
            </div>
            <div className="hidden lg:block">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </FlowbiteNavbar>
  );
};

export default Navbar;
