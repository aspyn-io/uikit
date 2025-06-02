import { Meta, StoryObj } from "@storybook/react-vite";
import { AppointmentCard } from "../components/AppointmentCard";

const meta: Meta<typeof AppointmentCard> = {
  title: "Cards/AppointmentCard",
  component: AppointmentCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppointmentCard>;

const today = new Date();

const workOrders = [
  { 
    id: "WO123", 
    status: "Active",
    description: "Rodent",
    duration: "60"
  },
  { 
    id: "WO124", 
    status: "Pending",
    description: "Flea & Tick",
    duration: "30"
  },
  { 
    id: "WO125", 
    status: "Completed",
    description: "German Roach",
    duration: "90"
  },
];

// Default Story
export const Default: Story = {
  args: {
    datetime: today,
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
    appointmentId: "APT123",
    onCalendarClick: (id: string) => console.log("Calendar clicked for appointment:", id),
  },
};

// Edit State with Work Orders
export const EditState: Story = {
  args: {
    datetime: today,
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    editable: true,
    workOrders: workOrders,
    onCancelWorkOrder: (id: string) => console.log("Canceled Work Order:", id),
    onRescheduleWorkOrder: (id: string) =>
      console.log("Rescheduled Work Order:", id),
    onWorkOrderClick: (id: string) => console.log("Clicked Work Order:", id),
    onRescheduleAppointment: () => console.log("Rescheduled Appointment"),
    onCancelAppointment: () => console.log("Canceled Appointment"),
    showIcons: true,
    appointmentId: "APT123",
    onCalendarClick: (id: string) => console.log("Calendar clicked for appointment:", id),
  },
};

// With Select Button
export const WithoutSelectButton: Story = {
  args: {
    datetime: today,
    calendarActive: true,
    timeActive: true,
    userActive: true,
    onSelect: () => console.log("Appointment Selected"),
    showIcons: true,
    appointmentId: "APT123",
    onCalendarClick: (id: string) => console.log("Calendar clicked for appointment:", id),
  },
};

// Selected Appointment Story
export const SelectedWithStatus: Story = {
  args: {
    datetime: today,
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    isSelected: true,
    onSelect: () => console.log("Appointment Selected"),
    showIcons: true,
    appointmentId: "APT123",
    onCalendarClick: (id: string) => console.log("Calendar clicked for appointment:", id),
  },
};

// Story without Icons
export const WithoutIcons: Story = {
  args: {
    datetime: today,
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: false,
    appointmentId: "APT123",
    onCalendarClick: (id: string) => console.log("Calendar clicked for appointment:", id),
  },
};
