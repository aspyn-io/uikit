import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar, { SidebarItemGroup, SidebarItem } from "../components/Sidebar";
import icon from "../images/icon.svg";
import { useEffect } from "react";
import {
  HiShoppingBag,
  HiUsers,
  HiInbox,
  HiUserCircle,
  HiCog,
  HiArchive,
  HiCurrencyDollar,
  HiOutlineTicket,
  HiLogout,
  HiChartPie,
  HiViewGrid,
  HiOutlinePhotograph, // Import placeholder icon
} from "react-icons/hi";
import { NavbarProvider, useNavbarContext } from "../context/NavbarContext";

/**
 * The `Navbar` component is an extension of the flowbite react navbar component.
 *
 * ```tsx
 * import Navbar from './Navbar';
 *
 * const MyNavbar = () => (
 *   <SidebarProvider>
 *     <Navbar title="Flowbite">
 *     </Navbar>
 *   </SidebarProvider>
 * );
 * ```
 */

const meta: Meta<typeof Navbar> = {
  title: "components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

// TODO: Fix sizing of icons in the app button component
const appButtons = [
  {
    icon: <HiShoppingBag className="h-8 w-8" />,
    title: "Sales",
    onClick: () => console.log("Sales clicked"),
  },
  {
    icon: <HiUsers className="h-8 w-8" />,
    title: "Users",
    onClick: () => console.log("Users clicked"),
  },
  {
    icon: <HiInbox className="h-8 w-8" />,
    title: "Inbox",
    onClick: () => console.log("Inbox clicked"),
  },
  {
    icon: <HiUserCircle className="h-8 w-8" />,
    title: "Profile",
    onClick: () => console.log("Profile clicked"),
  },
  {
    icon: <HiCog className="h-8 w-8" />,
    title: "Settings",
    onClick: () => console.log("Settings clicked"),
  },
  {
    icon: <HiArchive className="h-8 w-8" />,
    title: "Products",
    onClick: () => console.log("Products clicked"),
  },
  {
    icon: <HiCurrencyDollar className="h-8 w-8" />,
    title: "Pricing",
    onClick: () => console.log("Pricing clicked"),
  },
  {
    icon: <HiOutlineTicket className="h-8 w-8" />,
    title: "Billing",
    onClick: () => console.log("Billing clicked"),
  },
  {
    icon: <HiLogout className="h-8 w-8" />,
    title: "Logout",
    onClick: () => console.log("Logout clicked"),
  },
];

const userDropdownItems = [
  { title: "Dashboard", onClick: () => console.log("Dashboard clicked") },
  { title: "Settings", onClick: () => console.log("Settings clicked") },
  { title: "Earnings", onClick: () => console.log("Earnings clicked") },
  { title: "Sign out", onClick: () => console.log("Sign out clicked") },
];

const NavbarWithSidebarMenu = () => {
  const { setIsSidebarCollapsed, setShowSearch } = useNavbarContext();

  useEffect(() => {
    setIsSidebarCollapsed(false);
    setShowSearch(true);
  }, [setIsSidebarCollapsed, setShowSearch]); // Ensure this effect runs only once

  return (
    <>
      <Navbar
        logo={icon} // Rename icon to logo
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        avatar="https://i.pravatar.cc/300?img=6" // Optional avatar
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
        onClickExploreProducts={() => console.log("Explore Products clicked")} // Add console log for Explore Products click
      />
      <Sidebar>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiChartPie}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#" icon={HiViewGrid}>
            Kanban
          </SidebarItem>
          <SidebarItem href="#" icon={HiInbox} label="3">
            Inbox
          </SidebarItem>
        </SidebarItemGroup>
      </Sidebar>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <NavbarProvider>
      <Navbar
        logo={icon} // Rename icon to logo
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        avatar="https://i.pravatar.cc/300?img=6" // Optional avatar
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
        onClickExploreProducts={() => console.log("Explore Products clicked")} // Add console log for Explore Products click
      />
    </NavbarProvider>
  ),
};

export const WithSidebar: Story = {
  render: () => (
    <NavbarProvider>
      <NavbarWithSidebarMenu />
    </NavbarProvider>
  ),
};

export const NoSearch: Story = {
  render: () => (
    <NavbarProvider>
      <Navbar
        logo={icon} // Rename icon to logo
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        avatar="https://i.pravatar.cc/300?img=6" // Optional avatar
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
        onClickExploreProducts={() => console.log("Explore Products clicked")} // Add console log for Explore Products click
      />
    </NavbarProvider>
  ),
};

export const NoAvatar: Story = {
  render: () => (
    <NavbarProvider>
      <Navbar
        logo={icon} // Rename icon to logo
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
        onClickExploreProducts={() => console.log("Explore Products clicked")} // Add console log for Explore Products click
      />
    </NavbarProvider>
  ),
};

export const NoLogo: Story = {
  render: () => (
    <NavbarProvider>
      <Navbar
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        avatar="https://i.pravatar.cc/300?img=6" // Optional avatar
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
        onClickExploreProducts={() => console.log("Explore Products clicked")} // Add console log for Explore Products click
      />
    </NavbarProvider>
  ),
};
