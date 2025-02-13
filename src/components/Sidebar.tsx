import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

const Sidebar = ({ children, className, ...props }: SidebarProps) => {
  return (
    <FlowbiteSidebar className={`h-screen max-h-screen ${className}`} {...props}>
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
