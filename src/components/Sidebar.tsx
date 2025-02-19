import { Sidebar as FlowbiteSidebar } from "flowbite-react";
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
      className={`h-screen max-h-screen !rounded-none ${className} ${isSidebarCollapsed ? "w-16" : "w-64"}`}
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
