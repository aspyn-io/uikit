import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SchedulingSelector,
  WeekData,
  SelectedSlot,
  SchedulableSlot,
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

// Mock window options for time periods
// Note: The 'available' property is calculated dynamically based on selectedSlot openings
const mockWindowOptions = [
  {
    id: "8-10",
    label: "8:00 AM - 10:00 AM",
    start_time: "08:00:00",
    end_time: "10:00:00",
  },
  {
    id: "10-12",
    label: "10:00 AM - 12:00 PM",
    start_time: "10:00:00",
    end_time: "12:00:00",
  },
  {
    id: "12-2",
    label: "12:00 PM - 2:00 PM",
    start_time: "12:00:00",
    end_time: "14:00:00",
  },
  {
    id: "2-4",
    label: "2:00 PM - 4:00 PM",
    start_time: "14:00:00",
    end_time: "16:00:00",
  },
];

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
                user: {
                  id: "user-1",
                  name: "John Smith",
                },
                team: {
                  id: "team-1",
                  name: "Team Alpha",
                },
              },
            ],
            morning: [
              {
                start_at: `${dateString}T08:00:00Z`,
                end_at: `${dateString}T12:00:00Z`,
                calendar_id: "cal-1",
                user: {
                  id: "user-2",
                  name: "Sarah Johnson",
                },
                team: {
                  id: "team-2",
                  name: "Team Bravo",
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
                      user: {
                        id: "user-3",
                        name: "Mike Wilson",
                      },
                      team: {
                        id: "team-3",
                        name: "Team Charlie",
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

  const handleReserve = (schedulableSlot: SchedulableSlot) => {
    setReserveLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Reserving appointment:", {
        schedulableSlot,
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
      windowOptions={args.windowOptions || mockWindowOptions}
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
    displayWindowOptions: true,
    displayTeamOptions: true,
    displayTechnicianOptions: true,
    timezone: "America/New_York",
    showDateJumper: true,
    showTimezoneInfo: true,
    disablePastNavigation: true,
  },
};

export const WithoutPreferences: Story = {
  render: (args) => <SchedulingSelectorWrapper {...args} />,
  args: {
    displayWindowOptions: false,
    displayTeamOptions: false,
    displayTechnicianOptions: false,
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
    displayWindowOptions: true,
    displayTeamOptions: false,
    displayTechnicianOptions: false,
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
    displayWindowOptions: true,
    displayTeamOptions: true,
    displayTechnicianOptions: true,
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
    displayWindowOptions: true,
    displayTeamOptions: true,
    displayTechnicianOptions: true,
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
      openings: [
        {
          start_at: `${today}T08:00:00Z`,
          end_at: `${today}T12:00:00Z`,
          calendar_id: "cal-1",
          user: {
            id: "user-2",
            name: "Sarah Johnson",
          },
          team: {
            id: "team-2",
            name: "Team Bravo",
          },
        },
      ],
    });
    const [selectedWindow] = useState<string>("window-2");
    const [selectedTeam] = useState<string>("team-2");
    const [selectedTechnician] = useState<string>("tech-2");

    const handleReserve = (schedulableSlot: SchedulableSlot) => {
      setReserveLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Reserved:", schedulableSlot);
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
        windowOptions={mockWindowOptions}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        displayWindowOptions={true}
        displayTeamOptions={true}
        displayTechnicianOptions={true}
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
      openings: [
        {
          start_at: `${today}T08:00:00Z`,
          end_at: `${today}T12:00:00Z`,
          calendar_id: "cal-1",
          user: {
            id: "user-2",
            name: "Sarah Johnson",
          },
          team: {
            id: "team-2",
            name: "Team Bravo",
          },
        },
      ],
    });
    const [selectedWindow] = useState<string>("window-2");
    const [selectedTeam] = useState<string>("team-2");
    const [selectedTechnician] = useState<string>("tech-2");
    const [reservedSlot, setReservedSlot] = useState<SelectedSlot | null>(
      // Start with the slot already reserved
      {
        date: today,
        time_period: "morning",
        openings: [
          {
            start_at: `${today}T08:00:00Z`,
            end_at: `${today}T12:00:00Z`,
            calendar_id: "cal-1",
            user: {
              id: "user-2",
              name: "Sarah Johnson",
            },
            team: {
              id: "team-2",
              name: "Team Bravo",
            },
          },
        ],
      }
    );

    const handleReserve = (schedulableSlot: SchedulableSlot) => {
      setReserveLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Reserved:", schedulableSlot);
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
        windowOptions={mockWindowOptions}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        displayWindowOptions={true}
        displayTeamOptions={true}
        displayTechnicianOptions={true}
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
