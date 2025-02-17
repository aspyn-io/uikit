export { Navbar } from "./components/Navbar/Navbar";
export { Sidebar } from "./components/Sidebar";
export { SidebarProvider } from "./context/SidebarContext";
export { Modal } from "./components/Modal";

// Cards
export { AppointmentCard } from "./components/AppointmentCard";
export { NoteCard } from "./components/NoteCard";

// Optionally, add a default export if needed
const components = {
  Navbar,
  Sidebar,
  SidebarProvider,
  Modal,
  AppointmentCard,
  NoteCard,
};

export default components;
