import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SchedulingSelector,
  WeekData,
  SelectedSlot,
  WindowOption,
  WindowOptionWithAvailability,
  TeamOption,
  TechnicianOption,
  SchedulableSlot,
  TimeSlot,
} from "../components/scheduling";
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

// Wrapper args interface - accepts WindowOption[] which gets processed by the wrapper
interface WrapperArgs
  extends Omit<
    React.ComponentProps<typeof SchedulingSelector>,
    | "windowOptions"
    | "weekData"
    | "loading"
    | "onWeekChange"
    | "selectedSlot"
    | "onSlotSelect"
    | "schedulableSlot"
    | "teamOptions"
    | "technicianOptions"
  > {
  windowOptions?: WindowOption[];
}

type Story = StoryObj<WrapperArgs>;

// Helper function to process slot selection and compute available options
interface ProcessSlotSelectionParams {
  selectedSlot: SelectedSlot | null;
  windowOptions: WindowOption[];
  selectedWindow: string;
  selectedTeam: string;
  selectedTechnician: string;
}

interface ProcessSlotSelectionResult {
  windowOptionsWithAvailability: WindowOptionWithAvailability[];
  teamOptions: TeamOption[];
  technicianOptions: TechnicianOption[];
  schedulableSlot: SchedulableSlot | null;
}

const processSlotSelection = ({
  selectedSlot,
  windowOptions,
  selectedWindow,
  selectedTeam,
  selectedTechnician,
}: ProcessSlotSelectionParams): ProcessSlotSelectionResult => {
  // If no slot selected, return empty options
  if (!selectedSlot || !selectedSlot.openings) {
    return {
      windowOptionsWithAvailability: [],
      teamOptions: [],
      technicianOptions: [],
      schedulableSlot: null,
    };
  }

  const availableSlots = selectedSlot.openings;

  // Step 1: Filter slots by selected window (if window options exist and one is selected)
  let filteredByWindow = availableSlots;
  if (windowOptions.length > 0 && selectedWindow) {
    const selectedWindowOption = windowOptions.find(
      (w) => w.id === selectedWindow
    );
    if (selectedWindowOption) {
      filteredByWindow = availableSlots.filter((slot) => {
        // Extract time portion from ISO string
        const slotStart = slot.start_at.substring(11, 19);
        const slotEnd = slot.end_at.substring(11, 19);

        // Check if slot overlaps with selected window
        return (
          slotStart < selectedWindowOption.end_time &&
          slotEnd > selectedWindowOption.start_time
        );
      });
    }
  }

  // Step 2: Compute window options with availability
  const windowOptionsWithAvailability: WindowOptionWithAvailability[] =
    windowOptions.map((option) => {
      const available = availableSlots.some((slot) => {
        // Parse times from ISO strings - these are in UTC
        const slotStartDate = new Date(slot.start_at);
        const slotEndDate = new Date(slot.end_at);

        // Get the time portion in HH:MM:SS format from the ISO string
        // Extract just the time part (ignoring timezone for comparison with window times)
        const slotStart = slot.start_at.substring(11, 19);
        const slotEnd = slot.end_at.substring(11, 19);

        // Check if the slot overlaps with the window option
        // A slot is available for a window if the slot's time range overlaps with the window
        return slotStart < option.end_time && slotEnd > option.start_time;
      });
      return { ...option, available };
    });

  // Step 3: Extract unique teams from filtered slots
  const teamMap = new Map<string, TeamOption>();
  filteredByWindow.forEach((slot) => {
    if (slot.team) {
      if (!teamMap.has(slot.team.id)) {
        teamMap.set(slot.team.id, {
          id: slot.team.id,
          name: slot.team.name,
          available: true,
        });
      }
    }
  });
  const teamOptions = Array.from(teamMap.values());

  // Step 4: Filter by selected team
  let filteredByTeam = filteredByWindow;
  if (selectedTeam) {
    filteredByTeam = filteredByWindow.filter(
      (slot) => slot.team?.id === selectedTeam
    );
  }

  // Step 5: Extract unique technicians from team-filtered slots
  const technicianMap = new Map<string, TechnicianOption>();
  filteredByTeam.forEach((slot) => {
    if (slot.user) {
      if (!technicianMap.has(slot.user.id)) {
        technicianMap.set(slot.user.id, {
          id: slot.user.id,
          name: slot.user.name,
          available: true,
        });
      }
    }
  });
  const technicianOptions = Array.from(technicianMap.values());

  // Step 6: Filter by selected technician
  let filteredByTechnician = filteredByTeam;
  if (selectedTechnician) {
    filteredByTechnician = filteredByTeam.filter(
      (slot) => slot.user?.id === selectedTechnician
    );
  }

  // Step 7: Compute schedulable slot (pick first matching slot)
  const schedulableSlot: SchedulableSlot | null =
    filteredByTechnician.length > 0
      ? {
          selectedSlot,
          timeSlot: filteredByTechnician[0],
        }
      : null;

  return {
    windowOptionsWithAvailability,
    teamOptions,
    technicianOptions,
    schedulableSlot,
  };
};

// Mock window options for time periods
const mockWindowOptions: WindowOption[] = [
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
const SchedulingSelectorWrapper = (args: WrapperArgs) => {
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

  // Use the business logic utilities to compute options and schedulable slot
  const {
    windowOptionsWithAvailability,
    teamOptions,
    technicianOptions,
    schedulableSlot,
  } = processSlotSelection({
    selectedSlot,
    windowOptions: args.windowOptions || [],
    selectedWindow,
    selectedTeam,
    selectedTechnician,
  });

  const handleWeekChange = (weekStart: string, weekEnd: string) => {
    setLoading(true);
    setCurrentWeekStart(new Date(weekStart));
    // Simulate API call
    setTimeout(() => {
      setWeekData(generateMockWeekData(new Date(weekStart)));
      setLoading(false);
    }, 500);
  };

  const handleSlotSelect = (slot: SelectedSlot | null) => {
    setSelectedSlot(slot);
    // Reset preferences when slot changes
    if (
      slot?.date !== selectedSlot?.date ||
      slot?.time_period !== selectedSlot?.time_period
    ) {
      setSelectedWindow("");
      setSelectedTeam("");
      setSelectedTechnician("");
    }
  };

  const handleWindowChange = (windowId: string) => {
    setSelectedWindow(windowId);
    // Reset dependent preferences
    setSelectedTeam("");
    setSelectedTechnician("");
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeam(teamId);
    // Reset dependent preferences
    setSelectedTechnician("");
  };

  const handleTechnicianChange = (technicianId: string) => {
    setSelectedTechnician(technicianId);
  };

  const handleReserve = () => {
    if (!schedulableSlot) return;

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
      onSlotSelect={handleSlotSelect}
      windowOptions={windowOptionsWithAvailability}
      teamOptions={teamOptions}
      technicianOptions={technicianOptions}
      selectedWindow={selectedWindow}
      selectedTeam={selectedTeam}
      selectedTechnician={selectedTechnician}
      onWindowChange={handleWindowChange}
      onTeamChange={handleTeamChange}
      onTechnicianChange={handleTechnicianChange}
      schedulableSlot={schedulableSlot}
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
    const {
      windowOptionsWithAvailability,
      teamOptions,
      technicianOptions,
      schedulableSlot,
    } = processSlotSelection({
      selectedSlot,
      windowOptions: [],
      selectedWindow: "",
      selectedTeam: "",
      selectedTechnician: "",
    });

    return (
      <SchedulingSelector
        {...args}
        weekData={null}
        loading={true}
        onWeekChange={() => {}}
        selectedSlot={selectedSlot}
        onSlotSelect={setSelectedSlot}
        windowOptions={windowOptionsWithAvailability}
        teamOptions={teamOptions}
        technicianOptions={technicianOptions}
        schedulableSlot={schedulableSlot}
      />
    );
  },
  args: {
    windowOptions: mockWindowOptions,
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
    const [selectedWindow] = useState<string>("8-10");
    const [selectedTeam] = useState<string>("team-2");
    const [selectedTechnician] = useState<string>("user-2");

    // Use business logic to compute options
    const {
      windowOptionsWithAvailability,
      teamOptions,
      technicianOptions,
      schedulableSlot,
    } = processSlotSelection({
      selectedSlot,
      windowOptions: mockWindowOptions,
      selectedWindow,
      selectedTeam,
      selectedTechnician,
    });

    const handleReserve = () => {
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
        windowOptions={windowOptionsWithAvailability}
        teamOptions={teamOptions}
        technicianOptions={technicianOptions}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        timezone="America/New_York"
        reserveButtonText="Reserve Appointment"
        reserveLoading={reserveLoading}
        schedulableSlot={schedulableSlot}
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
    const [selectedWindow] = useState<string>("8-10");
    const [selectedTeam] = useState<string>("team-2");
    const [selectedTechnician] = useState<string>("user-2");
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

    // Use business logic to compute options
    const {
      windowOptionsWithAvailability,
      teamOptions,
      technicianOptions,
      schedulableSlot,
    } = processSlotSelection({
      selectedSlot,
      windowOptions: mockWindowOptions,
      selectedWindow,
      selectedTeam,
      selectedTechnician,
    });

    const handleReserve = () => {
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
        windowOptions={windowOptionsWithAvailability}
        teamOptions={teamOptions}
        technicianOptions={technicianOptions}
        selectedWindow={selectedWindow}
        selectedTeam={selectedTeam}
        selectedTechnician={selectedTechnician}
        onWindowChange={() => {}}
        onTeamChange={() => {}}
        onTechnicianChange={() => {}}
        timezone="America/New_York"
        reserveButtonText="Reserve Appointment"
        reserveLoading={reserveLoading}
        schedulableSlot={schedulableSlot}
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
