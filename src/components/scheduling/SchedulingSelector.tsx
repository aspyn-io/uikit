import React, { useState, useCallback, useMemo } from "react";
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

  // Preference options - pass empty arrays to hide sections
  windowOptions?: WindowOption[];
  teamOptions?: TeamOption[];
  technicianOptions?: TechnicianOption[];

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
  onReserve?: () => void;
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
  windowOptions = [],
  teamOptions = [],
  technicianOptions = [],
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

      onSlotSelect({
        date,
        time_period: timePeriod,
        slot,
      });
    },
    [onSlotSelect, reservedSlot]
  );

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
            {windowOptions.length > 0 && (
              <TimeWindowSelector
                options={windowOptions}
                selectedWindow={selectedWindow}
                onWindowChange={onWindowChange}
              />
            )}

            {/* Team Selector */}
            {teamOptions.length > 0 && (
              <TeamSelector
                options={teamOptions}
                selectedTeam={selectedTeam}
                onTeamChange={onTeamChange}
              />
            )}

            {/* Technician Selector */}
            {technicianOptions.length > 0 && (
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
            windowOptions={windowOptions}
            teamOptions={teamOptions}
            technicianOptions={technicianOptions}
            selectedWindow={selectedWindow}
            selectedTeam={selectedTeam}
            selectedTechnician={selectedTechnician}
            onReserve={onReserve}
            reserveButtonText={reserveButtonText}
            reserveButtonDisabled={reserveButtonDisabled}
            reserveLoading={reserveLoading}
            reservedSlot={reservedSlot}
            onCancelReservation={onCancelReservation}
            cancelButtonText={cancelButtonText}
            cancelLoading={cancelLoading}
          />
        </div>
      )}
    </div>
  );
};
