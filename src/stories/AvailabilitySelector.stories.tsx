import { Meta, StoryObj } from "@storybook/react-vite";
import {
  AvailabilitySelector,
  AppointmentAvailability,
} from "../components/AvailabilitySelector";
import { useState } from "react";

const meta: Meta<typeof AvailabilitySelector> = {
  title: "Forms/AvailabilitySelector",
  component: AvailabilitySelector,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AvailabilitySelector>;

const mockAvailabilityData: AppointmentAvailability[] = [
  {
    window_start_at: "2025-01-27T09:00:00Z",
    window_end_at: "2025-01-27T12:00:00Z",
    total_slots: 3,
    name: "Morning",
    openings: [
      {
        calendar_id: "cal-1",
        start_at: "2025-01-27T09:00:00Z",
        end_at: "2025-01-27T10:00:00Z",
        calendar: {
          id: "cal-1",
          name: "John's Calendar",
        },
      },
    ],
  },
  {
    window_start_at: "2025-01-27T13:00:00Z",
    window_end_at: "2025-01-27T17:00:00Z",
    total_slots: 5,
    name: "Afternoon",
    openings: [
      {
        calendar_id: "cal-2",
        start_at: "2025-01-27T13:00:00Z",
        end_at: "2025-01-27T14:00:00Z",
        calendar: {
          id: "cal-2",
          name: "Sarah's Calendar",
        },
      },
    ],
  },
  {
    window_start_at: "2025-01-27T08:00:00Z",
    window_end_at: "2025-01-27T18:00:00Z",
    total_slots: 8,
    name: "Anytime",
    openings: [
      {
        calendar_id: "cal-3",
        start_at: "2025-01-27T08:00:00Z",
        end_at: "2025-01-27T09:00:00Z",
        calendar: {
          id: "cal-3",
          name: "Mike's Calendar",
        },
      },
    ],
  },
];

// Template with state management
const AvailabilitySelectorTemplate = (args: any) => {
  const [schedulingType, setSchedulingType] = useState<"asap" | "specific">(
    "asap"
  );
  const [specificDate, setSpecificDate] = useState("");
  const [selectedTimeWindow, setSelectedTimeWindow] =
    useState<AppointmentAvailability | null>(null);
  const [customerNote, setCustomerNote] = useState("");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AvailabilitySelector
        {...args}
        schedulingType={schedulingType}
        onSchedulingTypeChange={setSchedulingType}
        specificDate={specificDate}
        onSpecificDateChange={setSpecificDate}
        selectedTimeWindow={selectedTimeWindow}
        onTimeWindowChange={setSelectedTimeWindow}
        customerNote={customerNote}
        onCustomerNoteChange={setCustomerNote}
      />
    </div>
  );
};

// Default Story
export const Default: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: mockAvailabilityData,
    loading: false,
    showNotes: true,
    showCsNumber: true,
    type: "create",
  },
};

// Loading State
export const Loading: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: [],
    loading: true,
    showNotes: true,
    showCsNumber: true,
    type: "create",
  },
};

// No Availability
export const NoAvailability: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: [],
    loading: false,
    showNotes: true,
    showCsNumber: true,
    type: "create",
  },
};

// Reschedule Type
export const RescheduleType: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: mockAvailabilityData,
    loading: false,
    showNotes: true,
    showCsNumber: true,
    type: "reschedule",
  },
};

// Reservice Type
export const ReserviceType: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: mockAvailabilityData,
    loading: false,
    showNotes: true,
    showCsNumber: true,
    type: "reservice",
  },
};

// Without Notes
export const WithoutNotes: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: mockAvailabilityData,
    loading: false,
    showNotes: false,
    showCsNumber: true,
    type: "create",
  },
};

// Without Customer Service Number
export const WithoutCsNumber: Story = {
  render: AvailabilitySelectorTemplate,
  args: {
    availabilityData: [],
    loading: false,
    showNotes: true,
    showCsNumber: false,
    type: "create",
  },
};
