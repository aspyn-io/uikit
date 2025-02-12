import { Meta, StoryObj } from '@storybook/react';
import Navbar from '../components/Navbar/Navbar';
import { HiMenuAlt1, HiSearch } from 'react-icons/hi';
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
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Navbar title="Aspyn">
      </Navbar>
    </SidebarProvider>
  ),
};
