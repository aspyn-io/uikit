import { Meta, StoryObj } from '@storybook/react';
import Navbar from '../components/Navbar/Navbar';
import { HiMenuAlt1, HiSearch, HiShoppingBag, HiUsers, HiInbox, HiUserCircle, HiCog, HiArchive, HiCurrencyDollar, HiOutlineTicket, HiLogout } from 'react-icons/hi';
import { SidebarProvider } from '../context/SidebarContext';
import { TextInput, DarkThemeToggle, Avatar, Dropdown } from 'flowbite-react';

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
  title: 'components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Navbar>;

/**
 * Default Example
 */
const notifications = [
  {
    avatar: "https://i.pravatar.cc/300?img=1",
    username: "Bonnie Green",
    content: ': "Hey, whats up? All set for the presentation?"',
    datetime: "a few moments ago",
    onClick: () => console.log("Notification 1 clicked"),
  },
  {
    avatar: "https://i.pravatar.cc/300?img=2",
    username: "Jese Leos",
    content: "and 5 others started following you.",
    datetime: "10 minutes ago",
    onClick: () => console.log("Notification 2 clicked"),
  },
  {
    avatar: "https://i.pravatar.cc/300?img=3",
    username: "Joseph Mcfall",
    content: "and 141 others love your story. See it and view more stories.",
    datetime: "44 minutes ago",
    onClick: () => console.log("Notification 3 clicked"),
  },
  {
    avatar: "https://i.pravatar.cc/300?img=4",
    username: "Leslie Livingston",
    content: 'mentioned you in a comment: @bonnie.green what do you say?',
    datetime: "1 hour ago",
    onClick: () => console.log("Notification 4 clicked"),
  },
  {
    avatar: "https://i.pravatar.cc/300?img=5",
    username: "Robert Brown",
    content: "posted a new video: Glassmorphism - learn how to implement the new design trend.",
    datetime: "3 hours ago",
    onClick: () => console.log("Notification 5 clicked"),
  },
];

// TODO: Fix sizing of icons in the app button component
const appButtons = [
  { icon: <HiShoppingBag className="h-8 w-8" />, title: "Sales", onClick: () => console.log("Sales clicked") },
  { icon: <HiUsers className="h-8 w-8" />, title: "Users", onClick: () => console.log("Users clicked") },
  { icon: <HiInbox className="h-8 w-8" />, title: "Inbox", onClick: () => console.log("Inbox clicked") },
  { icon: <HiUserCircle className="h-8 w-8" />, title: "Profile", onClick: () => console.log("Profile clicked") },
  { icon: <HiCog className="h-8 w-8" />, title: "Settings", onClick: () => console.log("Settings clicked") },
  { icon: <HiArchive className="h-8 w-8" />, title: "Products", onClick: () => console.log("Products clicked") },
  { icon: <HiCurrencyDollar className="h-8 w-8" />, title: "Pricing", onClick: () => console.log("Pricing clicked") },
  { icon: <HiOutlineTicket className="h-8 w-8" />, title: "Billing", onClick: () => console.log("Billing clicked") },
  { icon: <HiLogout className="h-8 w-8" />, title: "Logout", onClick: () => console.log("Logout clicked") },
];


const userDropdownItems = [
  { title: "Dashboard", onClick: () => console.log("Dashboard clicked") },
  { title: "Settings", onClick: () => console.log("Settings clicked") },
  { title: "Earnings", onClick: () => console.log("Earnings clicked") },
  { title: "Sign out", onClick: () => console.log("Sign out clicked") },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Navbar
        title="Aspyn"
        onSearch={(value) => console.log(value)}
        notifications={notifications}
        onViewAllNotifications={() => console.log("View all notifications")}
        appButtons={appButtons}
        avatar="https://i.pravatar.cc/300?img=6"
        username="Neil Sims"
        email="neil.sims@flowbite.com"
        userDropdownItems={userDropdownItems}
      />
    </SidebarProvider>
  ),
};
