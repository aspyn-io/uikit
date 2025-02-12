/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { DarkThemeToggle, TextInput } from "flowbite-react";
import { HiMenuAlt1, HiSearch, HiX } from "react-icons/hi";
import { useSidebarContext } from "../../context/SidebarContext";
import isSmallScreen from "../../helpers/is-small-screen";
import { Navbar as FlowbiteNavbar } from "flowbite-react";
import NotificationBellDropdown from "./NotificationBellDropdown";
import AppDrawerDropdown from "./AppDrawerDropdown";
import UserDropdown from "./UserDropdown";
import icon from "../../images/icon.svg";
import { NotificationItem } from "./NotificationItem";

interface NavbarProps {
  title: string;
  onSearch?: (value: string) => void;
  notifications?: NotificationItem[];
  onViewAllNotifications?: () => void;
  appButtons?: { icon: React.ReactNode; title: string }[];
  avatar: string;
  username: string;
  email: string;
  userDropdownItems: { title: string; onClick?: () => void }[];
}

export const Navbar: FC<NavbarProps> = function ({ title, onSearch, notifications = [], onViewAllNotifications, appButtons = [], avatar, username, email, userDropdownItems }) {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <FlowbiteNavbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <FlowbiteNavbar.Brand href="/">
              <img alt="" src={icon} className="mr-3 h-6 sm:h-8" />
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {title}
              </span>
            </FlowbiteNavbar.Brand>
            <form className="ml-16 hidden md:block">
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                size={32}
                type="search"
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </form>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              <NotificationBellDropdown
                notifications={notifications}
                onViewAll={onViewAllNotifications}
              />
              <AppDrawerDropdown appButtons={appButtons} />
              <DarkThemeToggle />
            </div>
            <div className="hidden lg:block">
              <UserDropdown avatar={avatar} username={username} email={email} items={userDropdownItems} />
            </div>
          </div>
        </div>
      </div>
    </FlowbiteNavbar>
  );
};

export default Navbar;
