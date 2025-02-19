/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { DarkThemeToggle, TextInput } from "flowbite-react";
import { HiMenuAlt1, HiSearch } from "react-icons/hi";
import { Navbar as FlowbiteNavbar } from "flowbite-react";
import NotificationBellDropdown from "./NotificationBellDropdown";
import AppDrawerDropdown from "./AppDrawerDropdown";
import UserDropdown from "./UserDropdown";
import { NotificationItem } from "./NotificationItem";
import { useNavbarContext } from "../../context/NavbarContext";

interface NavbarProps {
  notifications?: NotificationItem[];
  onViewAllNotifications?: () => void;
  appButtons?: { icon: React.ReactNode; title: string }[];
  avatar?: string; // Make avatar optional
  username: string;
  email: string;
  userDropdownItems: { title: string; onClick?: () => void }[];
  onClickExploreProducts?: () => void; // Add this prop to handle Explore Products click
  icon?: string; // Add this prop to set the navbar icon
}

export const Navbar: FC<NavbarProps> = function ({
  notifications = [],
  onViewAllNotifications,
  appButtons = [],
  avatar,
  username,
  email,
  userDropdownItems,
  onClickExploreProducts, // Add this prop to handle Explore Products click
  icon = "../../images/icon.svg", // Default icon
}) {
  const {
    title: contextTitle,
    showSearch: contextShowSearch,
    onSearch: contextOnSearch,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useNavbarContext();

  return (
    <FlowbiteNavbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
            >
              <span className="sr-only">Toggle sidebar</span>
              <HiMenuAlt1 className="h-6 w-6" />
            </button>
            <FlowbiteNavbar.Brand href="/">
              <img alt="" src={icon} className="mr-2 h-6 sm:h-8" /> {/* Use the icon prop */}
              <div className="border-l border-gray-500 h-8 mx-2"></div> {/* Light grey, more muted */}
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                {contextTitle}
              </span>
            </FlowbiteNavbar.Brand>
            {contextShowSearch && (
              <form className="ml-16 hidden md:block">
                <TextInput
                  icon={HiSearch}
                  id="search"
                  name="search"
                  placeholder="Search"
                  required
                  size={32}
                  type="search"
                  onChange={contextOnSearch}
                />
              </form>
            )}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <NotificationBellDropdown
                notifications={notifications}
                onViewAll={onViewAllNotifications}
              />
              <DarkThemeToggle />
              <AppDrawerDropdown appButtons={appButtons} onClickExploreProducts={onClickExploreProducts} />
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
