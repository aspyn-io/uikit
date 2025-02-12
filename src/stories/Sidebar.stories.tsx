import { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../components/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';
import { Sidebar as FlowbiteSidebar } from 'flowbite-react';
import {
  HiChartPie,
  HiViewGrid,
  HiInboxIn,
  HiShoppingBag,
  HiUsers,
  HiChartSquareBar,
  HiLockClosed,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
} from 'react-icons/hi';

/**
 * The `Sidebar` component is a versatile and customizable sidebar for navigation.
 * It supports multiple levels of navigation items, collapsible sections, and integrates
 * with `flowbite-react` components.
 *
 * ```tsx
 * import Sidebar from './Sidebar';
 *
 * const MySidebar = () => (
 *   <SidebarProvider>
 *     <Sidebar>
 *       <FlowbiteSidebar.ItemGroup>
 *         <FlowbiteSidebar.Item href="/" icon={HiChartPie}>Dashboard</FlowbiteSidebar.Item>
 *         <FlowbiteSidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</FlowbiteSidebar.Item>
 *         <FlowbiteSidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</FlowbiteSidebar.Item>
 *       </FlowbiteSidebar.ItemGroup>
 *     </Sidebar>
 *   </SidebarProvider>
 * );
 * ```
 */

const meta: Meta<typeof Sidebar> = {
  title: 'components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

/**
 * Default Example
 */
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="/" icon={HiChartPie}>Dashboard</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </Sidebar>
    </SidebarProvider>
  ),
};

/**
 * Item Collapse
 */
export const ItemCollapse: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="/" icon={HiChartPie}>Dashboard</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <FlowbiteSidebar.Item href="/e-commerce/products">Products</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/e-commerce/billing">Billing</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/e-commerce/invoice">Invoice</FlowbiteSidebar.Item>
          </FlowbiteSidebar.Collapse>
          <FlowbiteSidebar.Collapse icon={HiUsers} label="Users">
            <FlowbiteSidebar.Item href="/users/list">Users list</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/profile">Profile</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/feed">Feed</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/settings">Settings</FlowbiteSidebar.Item>
          </FlowbiteSidebar.Collapse>
        </FlowbiteSidebar.ItemGroup>
      </Sidebar>
    </SidebarProvider>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="w-16">
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
    <SidebarProvider>
      <Sidebar>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="/" icon={HiChartPie}>Dashboard</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <FlowbiteSidebar.Item href="/e-commerce/products">Products</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/e-commerce/billing">Billing</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/e-commerce/invoice">Invoice</FlowbiteSidebar.Item>
          </FlowbiteSidebar.Collapse>
          <FlowbiteSidebar.Collapse icon={HiUsers} label="Users">
            <FlowbiteSidebar.Item href="/users/list">Users list</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/profile">Profile</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/feed">Feed</FlowbiteSidebar.Item>
            <FlowbiteSidebar.Item href="/users/settings">Settings</FlowbiteSidebar.Item>
          </FlowbiteSidebar.Collapse>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={HiClipboard}>Docs</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="https://flowbite-react.com/" icon={HiCollection}>Components</FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={HiInformationCircle}>Help</FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </Sidebar>
    </SidebarProvider>
  ),
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
