/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { Link } from "react-router-dom";
import { DarkThemeToggle, TextInput, Tooltip } from "flowbite-react";
import { HiMenuAlt1, HiSearch, HiOutlinePhotograph } from "react-icons/hi"; // Import placeholder icon
import { Navbar as FlowbiteNavbar, NavbarBrand } from "flowbite-react";
import NotificationBellDropdown from "./NotificationBellDropdown";
import AppDrawerDropdown, { AppSection } from "./AppDrawerDropdown"; // Import AppSection interface
import UserDropdown from "./UserDropdown";
import { NotificationItem } from "./NotificationItem";
import { useNavbarContext } from "../../context/NavbarContext";

interface NavbarProps {
  notifications?: NotificationItem[];
  onViewAllNotifications?: () => void;
  sections?: AppSection[]; // Replace appButtons with sections
  avatar?: string; // Make avatar optional
  username: string;
  email: string;
  userDropdownItems: { title: string; onClick?: () => void }[];
  onClickExploreProducts?: () => void; // Add this prop to handle Explore Products click
  logo?: string; // Rename icon to logo
  logoLink?: string; // Add logoLink prop
}

export const Navbar: FC<NavbarProps> = function ({
  notifications = [],
  onViewAllNotifications,
  sections = [],
  avatar,
  username,
  email,
  userDropdownItems,
  onClickExploreProducts, // Add this prop to handle Explore Products click
  logo, // Rename icon to logo
  logoLink = "/", // Default value for logoLink
}) {
  const {
    title: contextTitle,
    showSearch: contextShowSearch,
    onSearch: contextOnSearch,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    titleLink: contextTitleLink, // Add titleLink from context
  } = useNavbarContext();

  return (
    <FlowbiteNavbar
      fluid
      className="py-0 fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
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
            {logo && (
              <Link to={logoLink}>
                <Tooltip content="Return to Home">
                  <img alt="Aspyn" src={logo} className="mr-3 h-8 sm:h-8" />
                </Tooltip>
              </Link>
            )}
            <NavbarBrand as={Link} href={contextTitleLink}>
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white border-l pl-3 border-gray-200 dark:border-gray-600 dark:border-">
                {contextTitle}
              </span>
            </NavbarBrand>
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
              <AppDrawerDropdown
                sections={sections}
                onClickExploreProducts={onClickExploreProducts}
              />
              <div className="ml-3">
                <UserDropdown
                  avatar={avatar}
                  username={username}
                  email={email}
                  items={userDropdownItems}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlowbiteNavbar>
  );
};

export default Navbar;
