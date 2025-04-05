import { Meta, StoryObj } from "@storybook/react";
import Sidebar, {
  SidebarItemGroup,
  SidebarItem,
  SidebarCollapse,
} from "../components/Sidebar";
import { useEffect } from "react";
import { NavbarProvider, useNavbarContext } from "../context/NavbarContext";
import {
  HiChartPie,
  HiViewGrid,
  HiInboxIn,
  HiShoppingBag,
  HiUsers,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
} from "react-icons/hi";

/**
 * The `Sidebar` component is an extension of the flowbite react sidebar component
 *
 * ```tsx
 * import Sidebar, { SidebarItemGroup, SidebarItem } from './Sidebar';
 *
 * const MySidebar = () => (
 *   <SidebarProvider>
 *     <Sidebar>
 *       <SidebarItemGroup>
 *         <SidebarItem href="#" icon={HiChartPie}>Dashboard</SidebarItem>
 *         <SidebarItem href="#" icon={HiViewGrid}>Kanban</SidebarItem>
 *         <SidebarItem href="#" icon={HiInboxIn} label="3">Inbox</SidebarItem>
 *       </SidebarItemGroup>
 *     </Sidebar>
 *   </SidebarProvider>
 * );
 * ```
 */

const meta: Meta<typeof Sidebar> = {
  title: "components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <NavbarProvider>
        <SetSidebarCollapsed>
          <div className="flex">
            <Story />
          </div>
        </SetSidebarCollapsed>
      </NavbarProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

const SetSidebarCollapsed = ({ children }: { children: React.ReactNode }) => {
  const { setIsSidebarCollapsed } = useNavbarContext();

  useEffect(() => {
    setIsSidebarCollapsed(false);
  }, [setIsSidebarCollapsed]);

  return <>{children}</>;
};

/**
 * Default Example
 */
export const Default: Story = {
  render: () => (
    <Sidebar>
      <SidebarItemGroup>
        <SidebarItem href="#" icon={HiChartPie}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="#" icon={HiViewGrid}>
          Kanban
        </SidebarItem>
        <SidebarItem href="#" icon={HiInboxIn} label="3">
          Inbox
        </SidebarItem>
      </SidebarItemGroup>
    </Sidebar>
  ),
};

/**
 * Item Collapse
 */
export const ItemCollapse: Story = {
  render: () => (
    <Sidebar>
      <SidebarItemGroup>
        <SidebarItem href="#" icon={HiChartPie}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="#" icon={HiViewGrid}>
          Kanban
        </SidebarItem>
        <SidebarItem href="#" icon={HiInboxIn} label="3">
          Inbox
        </SidebarItem>
        <SidebarCollapse icon={HiShoppingBag} label="E-commerce">
          <SidebarItem href="#">Products</SidebarItem>
          <SidebarItem href="#">Billing</SidebarItem>
          <SidebarItem href="#">Invoice</SidebarItem>
        </SidebarCollapse>
        <SidebarCollapse icon={HiUsers} label="Users">
          <SidebarItem href="#">Users list</SidebarItem>
          <SidebarItem href="#">Profile</SidebarItem>
          <SidebarItem href="#">Feed</SidebarItem>
          <SidebarItem href="#">Settings</SidebarItem>
        </SidebarCollapse>
      </SidebarItemGroup>
    </Sidebar>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

/**
 * Item Groups
 */
export const ItemGroups: Story = {
  render: () => (
    <Sidebar>
      <SidebarItemGroup>
        <SidebarItem href="#" icon={HiChartPie}>
          Dashboard
        </SidebarItem>
        <SidebarItem href="#" icon={HiViewGrid}>
          Kanban
        </SidebarItem>
        <SidebarItem href="#" icon={HiInboxIn} label="3">
          Inbox
        </SidebarItem>
      </SidebarItemGroup>
      <SidebarItemGroup>
        <SidebarCollapse icon={HiShoppingBag} label="E-commerce">
          <SidebarItem href="#">Products</SidebarItem>
          <SidebarItem href="#">Billing</SidebarItem>
          <SidebarItem href="#">Invoice</SidebarItem>
        </SidebarCollapse>
        <SidebarCollapse icon={HiUsers} label="Users">
          <SidebarItem href="#">Users list</SidebarItem>
          <SidebarItem href="#">Profile</SidebarItem>
          <SidebarItem href="#">Feed</SidebarItem>
          <SidebarItem href="#">Settings</SidebarItem>
        </SidebarCollapse>
      </SidebarItemGroup>
      <SidebarItemGroup>
        <SidebarItem href="#" icon={HiClipboard}>
          Docs
        </SidebarItem>
        <SidebarItem href="#" icon={HiCollection}>
          Components
        </SidebarItem>
        <SidebarItem href="#" icon={HiInformationCircle}>
          Help
        </SidebarItem>
      </SidebarItemGroup>
    </Sidebar>
  ),
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
