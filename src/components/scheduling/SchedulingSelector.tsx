import React, { useState, useCallback, useMemo, useEffect } from "react";
import { format, addWeeks, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { WeekGrid } from "./WeekGrid";
import { TimeWindowSelector } from "./Preferences/TimeWindowSelector";
import { TeamSelector } from "./Preferences/TeamSelector";
import { TechnicianSelector } from "./Preferences/TechnicianSelector";
import { SelectedAppointmentCard } from "./SelectedAppointmentCard";
import { useTimezoneFormat } from "./hooks/useTimezoneFormat";
import {
  WeekData,
  SelectedSlot,
  SchedulableSlot,
  WindowOption,
  TeamOption,
  TechnicianOption,
  Labels,
  TimePeriod,
  TimeSlot,
} from "./types";

interface SchedulingSelectorProps {
  // Week data with availability - controlled externally
  weekData: WeekData | null;
  loading: boolean;

  // Callback when week changes (user clicks prev/next or jumps to date)
  onWeekChange: (weekStart: string, weekEnd: string) => void;

  // Selection state - controlled
  selectedSlot: SelectedSlot | null;
  onSlotSelect: (slot: SelectedSlot | null) => void;

  // Callback when schedulable slot changes (when filters are applied)
  onSchedulableSlotChange?: (schedulableSlot: SchedulableSlot | null) => void;

  // Display flags for preference sections
  displayWindowOptions?: boolean;
  displayTeamOptions?: boolean;
  displayTechnicianOptions?: boolean;

  // Selected preferences - controlled
  selectedWindow?: string;
  selectedTeam?: string;
  selectedTechnician?: string;

  // Callbacks for preference changes
  onWindowChange?: (windowId: string) => void;
  onTeamChange?: (teamId: string) => void;
  onTechnicianChange?: (technicianId: string) => void;

  // Timezone support
  timezone?: string;
  timezoneDisplay?: string; // Custom display like "EDT (UTC-4)"

  // Reserved slot (for showing locked state)
  reservedSlot?: SelectedSlot | null;

  // Action button
  onReserve?: (schedulableSlot: SchedulableSlot) => void;
  reserveButtonText?: string;
  reserveButtonDisabled?: boolean;
  reserveLoading?: boolean;

  // Cancel reservation
  onCancelReservation?: () => void;
  cancelButtonText?: string;
  cancelLoading?: boolean;

  // UI customization
  showDateJumper?: boolean;
  showTimezoneInfo?: boolean;
  disablePastNavigation?: boolean;
  minDate?: Date;

  // Custom labels
  labels?: Labels;
}

export const SchedulingSelector: React.FC<SchedulingSelectorProps> = ({
  weekData,
  loading,
  onWeekChange,
  selectedSlot,
  onSlotSelect,
  onSchedulableSlotChange,
  displayWindowOptions = false,
  displayTeamOptions = false,
  displayTechnicianOptions = false,
  selectedWindow,
  selectedTeam,
  selectedTechnician,
  onWindowChange,
  onTeamChange,
  onTechnicianChange,
  timezone = "America/New_York",
  timezoneDisplay,
  reservedSlot,
  onReserve,
  reserveButtonText = "Reserve Appointment",
  reserveButtonDisabled = false,
  reserveLoading = false,
  onCancelReservation,
  cancelButtonText = "Cancel Reservation",
  cancelLoading = false,
  showDateJumper = true,
  showTimezoneInfo = true,
  disablePastNavigation = true,
  minDate,
  labels = {},
}) => {
  // Current week being displayed
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    if (weekData?.week_start) {
      return parseISO(weekData.week_start);
    }
    return startOfWeek(new Date(), { weekStartsOn: 0 });
  });

  // Use timezone formatting hook
  const { formatDate, getTimezoneDisplay } = useTimezoneFormat(
    timezone,
    timezoneDisplay
  );

  // Generate week dates (Sunday to Saturday)
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeekStart]);

  // Get availability for a specific date - passed to WeekGrid
  const getAvailabilityForDate = (dateString: string) => {
    if (!weekData?.days) return null;
    return weekData.days.find((day) => day.date === dateString) || null;
  };

  // Derive window, team, and technician options from selected slot's available TimeSlots
  const { windowOptions, teamOptions, technicianOptions } = useMemo(() => {
    if (!selectedSlot?.openings) {
      return { windowOptions: [], teamOptions: [], technicianOptions: [] };
    }

    const slots = selectedSlot.openings;

    // Extract unique windows (based on start_at/end_at)
    const windowMap = new Map<string, WindowOption>();
    slots.forEach((slot) => {
      const key = `${slot.start_at}-${slot.end_at}`;
      if (!windowMap.has(key)) {
        windowMap.set(key, {
          id: key,
          label: `${slot.start_at} - ${slot.end_at}`,
          start_time: slot.start_at,
          end_time: slot.end_at,
          available: true,
        });
      }
    });

    // Extract unique teams
    const teamMap = new Map<string, TeamOption>();
    slots.forEach((slot) => {
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

    // Extract unique technicians (users)
    const technicianMap = new Map<string, TechnicianOption>();
    slots.forEach((slot) => {
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

    return {
      windowOptions: Array.from(windowMap.values()),
      teamOptions: Array.from(teamMap.values()),
      technicianOptions: Array.from(technicianMap.values()),
    };
  }, [selectedSlot]);

  // Get the specific TimeSlot to schedule based on selected preferences
  const schedulableTimeSlot = useMemo(() => {
    if (!selectedSlot?.openings) return undefined;

    const slots = selectedSlot.openings;

    // Filter slots based on selected preferences
    const filtered = slots.filter((slot) => {
      // Filter by window (time range)
      if (selectedWindow) {
        const windowKey = `${slot.start_at}-${slot.end_at}`;
        if (windowKey !== selectedWindow) return false;
      }

      // Filter by team
      if (selectedTeam && slot.team?.id !== selectedTeam) return false;

      // Filter by technician
      if (selectedTechnician && slot.user?.id !== selectedTechnician)
        return false;

      return true;
    });

    // Return the first matching slot, or undefined if none match
    return filtered[0];
  }, [selectedSlot, selectedWindow, selectedTeam, selectedTechnician]);

  // Notify parent when schedulable slot changes
  useEffect(() => {
    if (onSchedulableSlotChange) {
      if (selectedSlot && schedulableTimeSlot) {
        onSchedulableSlotChange({
          selectedSlot,
          timeSlot: schedulableTimeSlot,
        });
      } else {
        onSchedulableSlotChange(null);
      }
    }
  }, [selectedSlot, schedulableTimeSlot, onSchedulableSlotChange]);

  // Check if date is in the past - simple utility function
  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Format week range - computed on demand
  const weekRange = (() => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    const startFormatted = formatDate(startDate, "MMM d, yyyy");
    const endFormatted = formatDate(endDate, "MMM d, yyyy");
    return `${startFormatted} - ${endFormatted}`;
  })();

  // Navigation handlers
  // Compute navigation disabled states inline
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canNavigatePrev =
    !reservedSlot &&
    (!disablePastNavigation ||
      endOfWeek(addWeeks(currentWeekStart, -1), { weekStartsOn: 0 }) >= today);

  const handlePrevWeek = () => {
    if (!canNavigatePrev) return;

    const newWeekStart = addWeeks(currentWeekStart, -1);
    const newWeekEnd = endOfWeek(newWeekStart, { weekStartsOn: 0 });
    setCurrentWeekStart(newWeekStart);
    onSlotSelect(null);
    onWeekChange(
      format(newWeekStart, "yyyy-MM-dd"),
      format(newWeekEnd, "yyyy-MM-dd")
    );
  };

  const handleNextWeek = () => {
    if (reservedSlot) return;

    const newWeekStart = addWeeks(currentWeekStart, 1);
    const newWeekEnd = endOfWeek(newWeekStart, { weekStartsOn: 0 });
    setCurrentWeekStart(newWeekStart);
    onSlotSelect(null);
    onWeekChange(
      format(newWeekStart, "yyyy-MM-dd"),
      format(newWeekEnd, "yyyy-MM-dd")
    );
  };

  // Handle date jump - only memoize callbacks that are passed to child components
  const handleDateJump = useCallback(
    (selectedDate: Date) => {
      const dayOfWeek = selectedDate.getDay();
      const sunday = new Date(selectedDate);
      sunday.setDate(selectedDate.getDate() - dayOfWeek);

      const newWeekEnd = endOfWeek(sunday, { weekStartsOn: 0 });
      setCurrentWeekStart(sunday);
      onSlotSelect(null);
      onWeekChange(
        format(sunday, "yyyy-MM-dd"),
        format(newWeekEnd, "yyyy-MM-dd")
      );
    },
    [onWeekChange, onSlotSelect]
  );

  // Handle slot selection - memoize to prevent WeekGrid re-renders
  const handleSlotClick = useCallback(
    (date: string, timePeriod: TimePeriod, slot?: TimeSlot) => {
      // Don't allow selection if there's a reservation for a different slot
      if (reservedSlot && reservedSlot.date !== date) return;

      // Get the available openings for this date and time period
      const dayAvailability = getAvailabilityForDate(date);
      const openings = dayAvailability?.slots[timePeriod] || [];

      // Don't pass the slot here - it will be determined by filters
      onSlotSelect({
        date,
        time_period: timePeriod,
        openings,
      });
    },
    [onSlotSelect, reservedSlot, weekData]
  );

  // Wrap onReserve to pass the schedulable slot
  const handleReserve = useCallback(() => {
    if (onReserve && selectedSlot && schedulableTimeSlot) {
      onReserve({
        selectedSlot,
        timeSlot: schedulableTimeSlot,
      });
    }
  }, [onReserve, selectedSlot, schedulableTimeSlot]);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <CalendarHeader
          weekRange={weekRange}
          canNavigatePrev={canNavigatePrev}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onDateJump={showDateJumper ? handleDateJump : undefined}
          showDateJumper={showDateJumper}
          showTimezoneInfo={showTimezoneInfo}
          timezoneDisplay={getTimezoneDisplay}
          minDate={minDate}
          isReserved={!!reservedSlot}
        />

        {/* Calendar Grid */}
        <WeekGrid
          weekDates={weekDates}
          loading={loading}
          getAvailabilityForDate={getAvailabilityForDate}
          isDateInPast={isDateInPast}
          selectedSlot={selectedSlot}
          reservedSlot={reservedSlot || null}
          onSlotClick={handleSlotClick}
          labels={labels}
        />
      </div>

      {/* Preferences Section */}
      {selectedSlot && (
        <div className="space-y-4">
          {/* Preferences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Window Selector */}
            {displayWindowOptions && windowOptions.length > 0 && (
              <TimeWindowSelector
                options={windowOptions}
                selectedWindow={selectedWindow}
                onWindowChange={onWindowChange}
              />
            )}

            {/* Team Selector */}
            {displayTeamOptions && teamOptions.length > 0 && (
              <TeamSelector
                options={teamOptions}
                selectedTeam={selectedTeam}
                onTeamChange={onTeamChange}
              />
            )}

            {/* Technician Selector */}
            {displayTechnicianOptions && technicianOptions.length > 0 && (
              <TechnicianSelector
                options={technicianOptions}
                selectedTechnician={selectedTechnician}
                onTechnicianChange={onTechnicianChange}
              />
            )}
          </div>

          {/* Selected Appointment Card */}
          <SelectedAppointmentCard
            selectedSlot={selectedSlot}
            formatDate={formatDate}
            selectedWindow={selectedWindow}
            selectedTeam={selectedTeam}
            selectedTechnician={selectedTechnician}
            onReserve={onReserve ? handleReserve : undefined}
            reserveButtonText={reserveButtonText}
            reserveButtonDisabled={
              reserveButtonDisabled || !schedulableTimeSlot
            }
            reserveLoading={reserveLoading}
            reservedSlot={reservedSlot}
            onCancelReservation={onCancelReservation}
            cancelButtonText={cancelButtonText}
            cancelLoading={cancelLoading}
            displayWindowOptions={displayWindowOptions}
            displayTeamOptions={displayTeamOptions}
            displayTechnicianOptions={displayTechnicianOptions}
          />
        </div>
      )}
    </div>
  );
};
