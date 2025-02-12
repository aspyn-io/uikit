import { Sidebar as FlowbiteSidebar } from "flowbite-react";

// Alias FlowbiteSidebar as Sidebar for now
// This allows us to import Sidebar from uikit and change as needed easily in the future
const Sidebar = FlowbiteSidebar;

// Re-export sidebar components to make them accessible from uikit
Sidebar.Item = FlowbiteSidebar.Item;
Sidebar.ItemGroup = FlowbiteSidebar.ItemGroup;
Sidebar.Items = FlowbiteSidebar.Items;
Sidebar.Collapse = FlowbiteSidebar.Collapse;

export default Sidebar;
