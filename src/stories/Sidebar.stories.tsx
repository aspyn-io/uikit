import { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../components/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';
import {
  HiChartPie,
  HiViewGrid,
  HiInboxIn,
  HiShoppingBag,
  HiUsers,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
} from 'react-icons/hi';

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
 *         <Sidebar.Item href="/" icon={HiChartPie}>Dashboard</Sidebar.Item>
 *         <Sidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</Sidebar.Item>
 *         <Sidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</Sidebar.Item>
 *       </Sidebar.ItemGroup>
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
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/" icon={HiChartPie}>Dashboard</Sidebar.Item>
          <Sidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</Sidebar.Item>
          <Sidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</Sidebar.Item>
        </Sidebar.ItemGroup>
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
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/" icon={HiChartPie}>Dashboard</Sidebar.Item>
          <Sidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</Sidebar.Item>
          <Sidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</Sidebar.Item>
          <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <Sidebar.Item href="/e-commerce/products">Products</Sidebar.Item>
            <Sidebar.Item href="/e-commerce/billing">Billing</Sidebar.Item>
            <Sidebar.Item href="/e-commerce/invoice">Invoice</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiUsers} label="Users">
            <Sidebar.Item href="/users/list">Users list</Sidebar.Item>
            <Sidebar.Item href="/users/profile">Profile</Sidebar.Item>
            <Sidebar.Item href="/users/feed">Feed</Sidebar.Item>
            <Sidebar.Item href="/users/settings">Settings</Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
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
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/" icon={HiChartPie}>Dashboard</Sidebar.Item>
          <Sidebar.Item href="/kanban" icon={HiViewGrid}>Kanban</Sidebar.Item>
          <Sidebar.Item href="/mailing/inbox" icon={HiInboxIn} label="3">Inbox</Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
            <Sidebar.Item href="/e-commerce/products">Products</Sidebar.Item>
            <Sidebar.Item href="/e-commerce/billing">Billing</Sidebar.Item>
            <Sidebar.Item href="/e-commerce/invoice">Invoice</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Collapse icon={HiUsers} label="Users">
            <Sidebar.Item href="/users/list">Users list</Sidebar.Item>
            <Sidebar.Item href="/users/profile">Profile</Sidebar.Item>
            <Sidebar.Item href="/users/feed">Feed</Sidebar.Item>
            <Sidebar.Item href="/users/settings">Settings</Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="https://github.com/themesberg/flowbite-react/" icon={HiClipboard}>Docs</Sidebar.Item>
          <Sidebar.Item href="https://flowbite-react.com/" icon={HiCollection}>Components</Sidebar.Item>
          <Sidebar.Item href="https://github.com/themesberg/flowbite-react/issues" icon={HiInformationCircle}>Help</Sidebar.Item>
        </Sidebar.ItemGroup>
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
