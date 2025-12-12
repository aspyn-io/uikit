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
    duration: "60",
  },
  {
    id: "WO124",
    status: "Pending",
    description: "Flea & Tick",
    duration: "30",
  },
  {
    id: "WO125",
    status: "Completed",
    description: "German Roach",
    duration: "90",
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
    onCalendarClick: (id: string) =>
      console.log("Calendar clicked for appointment:", id),
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
    onScheduleReturnService: () => console.log("Schedule Reservice"),
    showIcons: true,
    appointmentId: "APT123",
    onCalendarClick: (id: string) =>
      console.log("Calendar clicked for appointment:", id),
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
    onCalendarClick: (id: string) =>
      console.log("Calendar clicked for appointment:", id),
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
    onCalendarClick: (id: string) =>
      console.log("Calendar clicked for appointment:", id),
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
    onCalendarClick: (id: string) =>
      console.log("Calendar clicked for appointment:", id),
  },
};

// Date Variants - Today
export const Today: Story = {
  args: {
    datetime: new Date(),
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - Tomorrow
export const Tomorrow: Story = {
  args: {
    datetime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - In 5 Days
export const InFiveDays: Story = {
  args: {
    datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - In 3 Weeks
export const InThreeWeeks: Story = {
  args: {
    datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - In 6 Months
export const InSixMonths: Story = {
  args: {
    datetime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    status: "Scheduled",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - Yesterday
export const Yesterday: Story = {
  args: {
    datetime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "Completed",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - 5 Days Ago
export const FiveDaysAgo: Story = {
  args: {
    datetime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "Completed",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - 3 Months Ago
export const ThreeMonthsAgo: Story = {
  args: {
    datetime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    status: "Completed",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};

// Date Variants - 5 Years Ago
export const FiveYearsAgo: Story = {
  args: {
    datetime: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
    status: "Completed",
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
  },
};
