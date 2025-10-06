import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SchedulingSelector,
  WeekData,
  SelectedSlot,
} from "../components/SchedulingSelector";
import { addDays, format, startOfWeek, endOfWeek } from "date-fns";

const meta: Meta<typeof SchedulingSelector> = {
  title: "Components/SchedulingSelector",
  component: SchedulingSelector,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SchedulingSelector>;

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
  { id: "team-2", name: "Team Bravo" },
  { id: "team-3", name: "Team Charlie" },
];

const mockTechnicianOptions = [
  {
    id: "tech-1",
    name: "John Smith",
    rating: "4.8",
    experience: "5+ years",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "tech-2",
    name: "Sarah Johnson",
    rating: "4.9",
    experience: "3+ years",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "tech-3",
    name: "Mike Wilson",
    rating: "4.7",
    experience: "7+ years",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
];

// Interactive wrapper component
const SchedulingSelectorWrapper = (args: any) => {
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [loading, setLoading] = useState(false);
  const [weekData, setWeekData] = useState<WeekData | null>(
    generateMockWeekData(currentWeekStart)
  );
  const [reservedSlot, setReservedSlot] = useState<SelectedSlot | null>(null);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleWeekChange = (weekStart: string, weekEnd: string) => {
    setLoading(true);
    setCurrentWeekStart(new Date(weekStart));
    // Simulate API call
    setTimeout(() => {
      setWeekData(generateMockWeekData(new Date(weekStart)));
      setLoading(false);
    }, 500);
  };

  const handleReserve = () => {
    setReserveLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Reserving appointment:", {
        selectedSlot,
        selectedWindow,
        selectedTeam,
        selectedTechnician,
      });
      setReservedSlot(selectedSlot);
      setReserveLoading(false);
      alert("Appointment reserved!");
    }, 1000);
  };

  const handleCancelReservation = () => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      setCancelLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Cancelling reservation:", reservedSlot);
        setReservedSlot(null);
        setCancelLoading(false);
        alert("Reservation cancelled!");
      }, 1000);
    }
  };

  return (
    <SchedulingSelector
      {...args}
      weekData={weekData}
      loading={loading}
      onWeekChange={handleWeekChange}
      selectedSlot={selectedSlot}
      onSlotSelect={setSelectedSlot}
      selectedWindow={selectedWindow}
      selectedTeam={selectedTeam}
      selectedTechnician={selectedTechnician}
      onWindowChange={setSelectedWindow}
      onTeamChange={setSelectedTeam}
      onTechnicianChange={setSelectedTechnician}
      onReserve={handleReserve}
      reservedSlot={reservedSlot}
      reserveLoading={reserveLoading}
      onCancelReservation={handleCancelReservation}
      cancelLoading={cancelLoading}
    />
  );
};

export const Default: Story = {
  render: (args) => <SchedulingSelectorWrapper {...args} />,
  args: {
    windowOptions: mockWindowOptions,
    teamOptions: mockTeamOptions,
    technicianOptions: mockTechnicianOptions,
    timezone: "America/New_York",
    showDateJumper: true,
    showTimezoneInfo: true,
    disablePastNavigation: true,
  },
};

export const WithoutPreferences: Story = {
  render: (args) => <SchedulingSelectorWrapper {...args} />,
  args: {
    windowOptions: [],
    teamOptions: [],
    technicianOptions: [],
    timezone: "America/New_York",
    showDateJumper: true,
    showTimezoneInfo: true,
    disablePastNavigation: true,
  },
};

export const WindowsOnly: Story = {
  render: (args) => <SchedulingSelectorWrapper {...args} />,
  args: {
    windowOptions: mockWindowOptions,
    teamOptions: [],
    technicianOptions: [],
    timezone: "America/New_York",
    showDateJumper: true,
    showTimezoneInfo: true,
    disablePastNavigation: true,
  },
};

export const CustomLabels: Story = {
  render: (args) => <SchedulingSelectorWrapper {...args} />,
  args: {
    windowOptions: mockWindowOptions,
    teamOptions: mockTeamOptions,
    technicianOptions: mockTechnicianOptions,
    timezone: "America/Los_Angeles",
    timezoneDisplay: "PST (UTC-8)",
    showDateJumper: true,
    showTimezoneInfo: true,
    labels: {
      anyTime: "Flexible",
      morning: "AM",
      afternoon: "PM",
      unavailable: "Not Available",
      past: "Expired",
    },
  },
};

export const Loading: Story = {
  render: (args) => {
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

    return (
      <SchedulingSelector
        {...args}
        weekData={null}
        loading={true}
        onWeekChange={() => {}}
        selectedSlot={selectedSlot}
        onSlotSelect={setSelectedSlot}
      />
    );
  },
  args: {
    windowOptions: mockWindowOptions,
    teamOptions: mockTeamOptions,
    technicianOptions: mockTechnicianOptions,
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
      <SchedulingSelector
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

export const WithReservationAndCancel: Story = {
  render: () => {
    const [currentWeekStart] = useState(() =>
      startOfWeek(new Date(), { weekStartsOn: 0 })
    );
    const [weekData] = useState<WeekData | null>(() =>
      generateMockWeekData(currentWeekStart)
    );
    const [loading] = useState(false);
    const [reserveLoading, setReserveLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
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
    const [reservedSlot, setReservedSlot] = useState<SelectedSlot | null>(
      // Start with the slot already reserved
      {
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
      }
    );

    const handleReserve = () => {
      setReserveLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReserveLoading(false);
        setReservedSlot(selectedSlot);
        alert("Appointment reserved successfully!");
      }, 1000);
    };

    const handleCancel = () => {
      if (window.confirm("Are you sure you want to cancel this reservation?")) {
        setCancelLoading(true);
        // Simulate API call
        setTimeout(() => {
          setReservedSlot(null);
          setCancelLoading(false);
          alert("Reservation cancelled successfully!");
        }, 1000);
      }
    };

    return (
      <SchedulingSelector
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
        reservedSlot={reservedSlot}
        onCancelReservation={handleCancel}
        cancelButtonText="Cancel Reservation"
        cancelLoading={cancelLoading}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a reserved appointment with the ability to cancel it. The appointment starts in a reserved state, and clicking the cancel button will prompt for confirmation before cancelling.",
      },
    },
  },
};
