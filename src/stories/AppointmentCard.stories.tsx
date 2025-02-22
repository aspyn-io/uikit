import * as React from "react";
import { Meta, StoryObj } from "@storybook/react";

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
  { id: "WO123", orderId: "ORDER456", status: "Active" },
  { id: "WO124", orderId: "ORDER457", status: "Pending" },
  { id: "WO125", orderId: "ORDER458", status: "Completed" },
];

// Default Story
export const Default: Story = {
  args: {
    datetime: today,
    calendarActive: true,
    timeActive: true,
    userActive: true,
    showIcons: true,
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
    onRescheduleAppointment: () => console.log("Rescheduled Appointment"),
    onCancelAppointment: () => console.log("Canceled Appointment"),
    showIcons: true,
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
  },
};
