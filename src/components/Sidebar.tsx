import {
  Sidebar as FlowbiteSidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarCollapse,
} from "flowbite-react";
import { ReactNode } from "react";
import { useNavbarContext } from "../context/NavbarContext";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  const { isSidebarCollapsed } = useNavbarContext();

  return (
    <FlowbiteSidebar
      theme={{
        root: {
          base: "h-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 shadow-none rounded-none", // ✅ Removed rounded edges
          inner:
            "h-full overflow-y-auto overflow-x-hidden bg-inherit py-4 px-3",
        },
      }}
      className={`${className}`}
      collapsed={isSidebarCollapsed}
      {...props}
    >
      {children}
    </FlowbiteSidebar>
  );
};

// Re-export the imported components directly
Sidebar.Item = SidebarItem;
Sidebar.ItemGroup = SidebarItemGroup;
Sidebar.Items = SidebarItems;
Sidebar.Collapse = SidebarCollapse;

export default Sidebar;
