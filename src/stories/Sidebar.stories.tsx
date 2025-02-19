import { Meta, StoryObj } from "@storybook/react";
import Sidebar from "../components/Sidebar";
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
 * import Sidebar from './Sidebar';
 *
 * const MySidebar = () => (
 *   <SidebarProvider>
 *     <Sidebar>
 *       <Sidebar.ItemGroup>
 *         <Sidebar.Item href="#" icon={HiChartPie}>Dashboard</Sidebar.Item>
 *         <Sidebar.Item href="#" icon={HiViewGrid}>Kanban</Sidebar.Item>
 *         <Sidebar.Item href="#" icon={HiInboxIn} label="3">Inbox</Sidebar.Item>
 *       </Sidebar.ItemGroup>
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
      <Sidebar.ItemGroup>
        <Sidebar.Item href="#" icon={HiChartPie}>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiViewGrid}>
          Kanban
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiInboxIn} label="3">
          Inbox
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  ),
};

/**
 * Item Collapse
 */
export const ItemCollapse: Story = {
  render: () => (
    <Sidebar>
      <Sidebar.ItemGroup>
        <Sidebar.Item href="#" icon={HiChartPie}>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiViewGrid}>
          Kanban
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiInboxIn} label="3">
          Inbox
        </Sidebar.Item>
        <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
          <Sidebar.Item href="#">Products</Sidebar.Item>
          <Sidebar.Item href="#">Billing</Sidebar.Item>
          <Sidebar.Item href="#">Invoice</Sidebar.Item>
        </Sidebar.Collapse>
        <Sidebar.Collapse icon={HiUsers} label="Users">
          <Sidebar.Item href="#">Users list</Sidebar.Item>
          <Sidebar.Item href="#">Profile</Sidebar.Item>
          <Sidebar.Item href="#">Feed</Sidebar.Item>
          <Sidebar.Item href="#">Settings</Sidebar.Item>
        </Sidebar.Collapse>
      </Sidebar.ItemGroup>
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
      <Sidebar.ItemGroup>
        <Sidebar.Item href="#" icon={HiChartPie}>
          Dashboard
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiViewGrid}>
          Kanban
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiInboxIn} label="3">
          Inbox
        </Sidebar.Item>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
          <Sidebar.Item href="#">Products</Sidebar.Item>
          <Sidebar.Item href="#">Billing</Sidebar.Item>
          <Sidebar.Item href="#">Invoice</Sidebar.Item>
        </Sidebar.Collapse>
        <Sidebar.Collapse icon={HiUsers} label="Users">
          <Sidebar.Item href="#">Users list</Sidebar.Item>
          <Sidebar.Item href="#">Profile</Sidebar.Item>
          <Sidebar.Item href="#">Feed</Sidebar.Item>
          <Sidebar.Item href="#">Settings</Sidebar.Item>
        </Sidebar.Collapse>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Sidebar.Item href="#" icon={HiClipboard}>
          Docs
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiCollection}>
          Components
        </Sidebar.Item>
        <Sidebar.Item href="#" icon={HiInformationCircle}>
          Help
        </Sidebar.Item>
      </Sidebar.ItemGroup>
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
