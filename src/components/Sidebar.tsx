import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { ReactNode } from "react";
import { useNavbarContext } from "../context/NavbarContext";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export const Sidebar = ({ children, ...props }: SidebarProps) => {
  const { isSidebarCollapsed } = useNavbarContext();

  return (
    <FlowbiteSidebar
      theme={{
        root: {
          base: "h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 shadow-none rounded-none", // ✅ Removed rounded edges
          inner: "h-full overflow-y-auto overflow-x-hidden bg-inherit py-4 px-3",
        },
      }}
      className={`h-screen max-h-screen`}
      collapsed={isSidebarCollapsed}
      {...props}
    >
      {children}
    </FlowbiteSidebar>
  );
};

// Re-export sidebar components to make them accessible from uikit
Sidebar.Item = FlowbiteSidebar.Item;
Sidebar.ItemGroup = FlowbiteSidebar.ItemGroup;
Sidebar.Items = FlowbiteSidebar.Items;
Sidebar.Collapse = FlowbiteSidebar.Collapse;

export default Sidebar;
