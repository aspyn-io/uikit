import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  RescheduleSelector,
  WeekData,
  SelectedSlot,
} from "../components/RescheduleSelector";
import { addDays, format, startOfWeek, endOfWeek } from "date-fns";

const meta: Meta<typeof RescheduleSelector> = {
  title: "Components/RescheduleSelector",
  component: RescheduleSelector,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RescheduleSelector>;

// Helper function to generate mock week data
const generateMockWeekData = (weekStart: Date): WeekData => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dateString = format(date, "yyyy-MM-dd");

    // Make some days unavailable
    const isAvailable = i !== 0 && i !== 6; // Sunday and Saturday unavailable

    days.push({
      date: dateString,
      is_available: isAvailable,
      slots: isAvailable
        ? {
            any_time: [
              {
                start_at: `${dateString}T08:00:00Z`,
                end_at: `${dateString}T17:00:00Z`,
                calendar_id: "cal-1",
                calendar: {
                  id: "cal-1",
                  name: "Main Calendar",
                },
              },
            ],
            morning: [
              {
                start_at: `${dateString}T08:00:00Z`,
                end_at: `${dateString}T12:00:00Z`,
                calendar_id: "cal-1",
                calendar: {
                  id: "cal-1",
                  name: "Main Calendar",
                },
              },
            ],
            afternoon:
              i === 2
                ? undefined
                : [
                    // Wednesday has no afternoon slots
                    {
                      start_at: `${dateString}T12:00:00Z`,
                      end_at: `${dateString}T17:00:00Z`,
                      calendar_id: "cal-1",
                      calendar: {
                        id: "cal-1",
                        name: "Main Calendar",
                      },
                    },
                  ],
          }
        : {
            any_time: undefined,
            morning: undefined,
            afternoon: undefined,
            evening: undefined,
          },
    });
  }

  return {
    week_start: format(weekStart, "yyyy-MM-dd"),
    week_end: format(weekEnd, "yyyy-MM-dd"),
    days,
  };
};

// Mock options
const mockWindowOptions = [
  { id: "window-1", label: "8:00 AM - 10:00 AM" },
  { id: "window-2", label: "10:00 AM - 12:00 PM" },
  { id: "window-3", label: "12:00 PM - 2:00 PM" },
  { id: "window-4", label: "2:00 PM - 4:00 PM" },
];

const mockTeamOptions = [
  { id: "team-1", name: "Team Alpha" },
  { id: "team-2", name: "Team Beta" },
  { id: "team-3", name: "Team Gamma" },
];

const mockTechnicianOptions = [
  { id: "tech-1", name: "John Smith" },
  { id: "tech-2", name: "Jane Doe" },
  { id: "tech-3", name: "Bob Johnson" },
];

// Interactive wrapper component
const InteractiveRescheduleSelector = (args: any) => {
  const [currentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [weekData, setWeekData] = useState<WeekData | null>(() =>
    generateMockWeekData(currentWeekStart)
  );
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");

  const handleWeekChange = (weekStart: string, weekEnd: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newWeekData = generateMockWeekData(new Date(weekStart));
      setWeekData(newWeekData);
      setLoading(false);
      setSelectedSlot(null);
    }, 1000);
  };

  const handleSlotSelect = (slot: SelectedSlot) => {
    setSelectedSlot(slot);
  };

  const handleReserve = () => {
    alert(
      `Reserving appointment:\nDate: ${selectedSlot?.date}\nTime: ${
        selectedSlot?.time_period
      }\nWindow: ${selectedWindow || "None"}\nTeam: ${
        selectedTeam || "Any"
      }\nTechnician: ${selectedTechnician || "Any"}`
    );
  };

  return (
    <RescheduleSelector
      {...args}
      weekData={weekData}
      loading={loading}
      onWeekChange={handleWeekChange}
      selectedSlot={selectedSlot}
      onSlotSelect={handleSlotSelect}
      selectedWindow={selectedWindow}
      selectedTeam={selectedTeam}
      selectedTechnician={selectedTechnician}
      onWindowChange={setSelectedWindow}
      onTeamChange={setSelectedTeam}
      onTechnicianChange={setSelectedTechnician}
      onReserve={handleReserve}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveRescheduleSelector {...args} />,
  args: {
    windowOptions: mockWindowOptions,
    teamOptions: mockTeamOptions,
    technicianOptions: mockTechnicianOptions,
    timezone: "America/New_York",
    reserveButtonText: "Reserve Appointment",
    reserveButtonDisabled: false,
  },
};

export const Loading: Story = {
  render: (args) => <InteractiveRescheduleSelector {...args} />,
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when fetching availability data.",
      },
    },
  },
};

export const WithoutPreferences: Story = {
  render: (args) => <InteractiveRescheduleSelector {...args} />,
  args: {
    windowOptions: [],
    teamOptions: [],
    technicianOptions: [],
    timezone: "America/Los_Angeles",
    reserveButtonText: "Confirm Reschedule",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component without any preference options.",
      },
    },
  },
};

export const PacificTimezone: Story = {
  render: (args) => <InteractiveRescheduleSelector {...args} />,
  args: {
    ...Default.args,
    timezone: "America/Los_Angeles",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component with Pacific timezone.",
      },
    },
  },
};

export const WithSelection: Story = {
  render: () => {
    const [currentWeekStart] = useState(() =>
      startOfWeek(new Date(), { weekStartsOn: 0 })
    );
    const [weekData] = useState<WeekData | null>(() =>
      generateMockWeekData(currentWeekStart)
    );
    const [loading] = useState(false);
    const today = format(addDays(currentWeekStart, 1), "yyyy-MM-dd"); // Monday
    const [selectedSlot] = useState<SelectedSlot>({
      date: today,
      time_period: "evening",
      slot: {
        start_at: `${today}T17:00:00Z`,
        end_at: `${today}T20:00:00Z`,
        calendar_id: "cal-1",
        calendar: {
          id: "cal-1",
          name: "Main Calendar",
        },
      },
    });
    const [selectedWindow] = useState<string>("window-1");
    const [selectedTeam] = useState<string>("team-1");
    const [selectedTechnician] = useState<string>("tech-1");

    return (
      <RescheduleSelector
        weekData={weekData}
        loading={loading}
        onWeekChange={() => {}}
        selectedSlot={selectedSlot}
        onSlotSelect={() => {}}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        windowOptions={mockWindowOptions}
        teamOptions={mockTeamOptions}
        technicianOptions={mockTechnicianOptions}
        timezone="America/New_York"
        reserveButtonText="Reserve Appointment"
        onReserve={() => alert("Appointment reserved!")}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component with a pre-selected slot and preferences.",
      },
    },
  },
};

export const WithReserveLoading: Story = {
  render: () => {
    const [currentWeekStart] = useState(() =>
      startOfWeek(new Date(), { weekStartsOn: 0 })
    );
    const [weekData] = useState<WeekData | null>(() =>
      generateMockWeekData(currentWeekStart)
    );
    const [loading] = useState(false);
    const [reserveLoading, setReserveLoading] = useState(false);
    const today = format(addDays(currentWeekStart, 1), "yyyy-MM-dd"); // Monday
    const [selectedSlot] = useState<SelectedSlot>({
      date: today,
      time_period: "morning",
      slot: {
        start_at: `${today}T08:00:00Z`,
        end_at: `${today}T12:00:00Z`,
        calendar_id: "cal-1",
        calendar: {
          id: "cal-1",
          name: "Main Calendar",
        },
      },
    });
    const [selectedWindow] = useState<string>("window-2");
    const [selectedTeam] = useState<string>("team-2");
    const [selectedTechnician] = useState<string>("tech-2");

    const handleReserve = () => {
      setReserveLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReserveLoading(false);
        alert("Appointment reserved successfully!");
      }, 2000);
    };

    return (
      <RescheduleSelector
        weekData={weekData}
        loading={loading}
        onWeekChange={() => {}}
        selectedSlot={selectedSlot}
        onSlotSelect={() => {}}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        windowOptions={mockWindowOptions}
        teamOptions={mockTeamOptions}
        technicianOptions={mockTechnicianOptions}
        timezone="America/New_York"
        reserveButtonText="Reserve Appointment"
        reserveLoading={reserveLoading}
        onReserve={handleReserve}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the reserve button loading state. Click the reserve button to see the loading state for 2 seconds before completing.",
      },
    },
  },
};
