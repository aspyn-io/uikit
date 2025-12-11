import React, { useState, useCallback, useMemo } from "react";
import { format, addWeeks, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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
  WindowOptionWithAvailability,
  TeamOption,
  TechnicianOption,
  CustomLabels,
  TimePeriod,
  TimePeriodConfig,
  DayAvailability,
} from "./types";

/**
 * SchedulingSelector - A comprehensive appointment scheduling component
 *
 * This component provides a week-based calendar view with time period selection,
 * preference filtering (time windows, teams, technicians), and appointment reservation.
 *
 * @example
 * ```tsx
 * <SchedulingSelector
 *   weekData={weekData}
 *   loading={loading}
 *   onWeekChange={handleWeekChange}
 *   selectedSlot={selectedSlot}
 *   onSlotSelect={setSelectedSlot}
 *   onReserve={handleReserve}
 * />
 * ```
 */
interface SchedulingSelectorProps {
  // Week data with availability - controlled externally
  weekData: WeekData | null;
  loading: boolean;

  // Callback when week changes (user clicks prev/next or jumps to date)
  onWeekChange: (
    weekStart: string,
    weekEnd: string,
    skipAutoAdvance?: boolean
  ) => void;

  // Selection state - controlled
  selectedSlot: SelectedSlot | null;
  onSlotSelect: (slot: SelectedSlot | null) => void;

  // Time period configuration - defines which time periods to display
  timePeriods?: TimePeriodConfig[];

  // Computed options - passed from parent after slot selection
  windowOptions?: WindowOptionWithAvailability[];
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

  // Computed schedulable slot - passed from parent
  schedulableSlot?: SchedulableSlot | null;

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
  preferencesLoading?: boolean; // Loading state for preferences and appointment card
  showSelectedAppointmentCard?: boolean; // Allow hiding the selected appointment card

  // Custom labels for UI text (e.g., internationalization)
  customLabels?: CustomLabels;

  // Selected time period from calendar (for contextual "Any time window" label)
  selectedTimePeriod?: string;
}

export const SchedulingSelector: React.FC<SchedulingSelectorProps> = ({
  weekData,
  loading,
  onWeekChange,
  selectedSlot,
  onSlotSelect,
  timePeriods = [
    { id: "any_time", label: "Any time" },
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
  ],
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
  schedulableSlot,
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
  preferencesLoading = false,
  showSelectedAppointmentCard = true,
  customLabels = {},
  selectedTimePeriod,
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

  // Get availability for a specific date - memoized to prevent unnecessary recalculations
  const getAvailabilityForDate = useCallback(
    (dateString: string): DayAvailability | null => {
      if (!weekData?.days) return null;
      return weekData.days.find((day) => day.date === dateString) || null;
    },
    [weekData?.days]
  );

  // Check if date is in the past - timezone-aware utility function
  const isDateInPast = useCallback(
    (date: Date): boolean => {
      // Get current date in the specified timezone
      const nowInTimezone = toZonedTime(new Date(), timezone);
      nowInTimezone.setHours(0, 0, 0, 0);

      // Convert the check date to the same timezone
      const checkDateInTimezone = toZonedTime(date, timezone);
      checkDateInTimezone.setHours(0, 0, 0, 0);

      return checkDateInTimezone < nowInTimezone;
    },
    [timezone]
  );

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
      format(newWeekEnd, "yyyy-MM-dd"),
      true // Skip auto-advance for manual navigation
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
      format(newWeekEnd, "yyyy-MM-dd"),
      true // Skip auto-advance for manual navigation
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
        format(newWeekEnd, "yyyy-MM-dd"),
        true // Skip auto-advance for manual navigation
      );
    },
    [onWeekChange, onSlotSelect]
  );

  // Handle slot selection - memoize to prevent WeekGrid re-renders
  const handleSlotClick = useCallback(
    (date: string, timePeriod: TimePeriod) => {
      // Don't allow selection if there's a reservation for a different slot
      if (reservedSlot && reservedSlot.date !== date) return;

      // Get the available openings for this date and time period
      const dayAvailability = getAvailabilityForDate(date);
      const openings = dayAvailability?.slots[timePeriod] || [];

      // Pass the openings to parent - parent will handle filtering and option generation
      onSlotSelect({
        date,
        time_period: timePeriod,
        openings,
      });
    },
    [onSlotSelect, reservedSlot, getAvailabilityForDate]
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
          timePeriods={timePeriods}
          customLabels={customLabels}
        />
      </div>

      {/* Preferences Section */}
      {selectedSlot && (
        <div className="space-y-4">
          {/* Preferences Grid */}
          {preferencesLoading ? (
            <>
              {/* Skeleton Loading State for Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Skeleton Loading State for Appointment Card */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                <div className="space-y-4">
                  {/* Date and Time Period Skeleton */}
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>

                  {/* Details Skeleton */}
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-44 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="pt-4">
                    <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Time Window Selector */}
                {windowOptions && windowOptions.length > 0 && (
                  <TimeWindowSelector
                    options={windowOptions}
                    selectedWindow={selectedWindow}
                    onWindowChange={onWindowChange}
                    formatDate={formatDate}
                    selectedTimePeriod={selectedTimePeriod}
                  />
                )}

                {/* Team Selector */}
                {teamOptions && teamOptions.length > 0 && (
                  <TeamSelector
                    options={teamOptions}
                    selectedTeam={selectedTeam}
                    onTeamChange={onTeamChange}
                  />
                )}

                {/* Technician Selector */}
                {technicianOptions && technicianOptions.length > 0 && (
                  <TechnicianSelector
                    options={technicianOptions}
                    selectedTechnician={selectedTechnician}
                    onTechnicianChange={onTechnicianChange}
                  />
                )}
              </div>

              {/* Selected Appointment Card */}
              {showSelectedAppointmentCard && (
                <SelectedAppointmentCard
                  selectedSlot={selectedSlot}
                  formatDate={formatDate}
                  selectedWindow={selectedWindow}
                  selectedTeam={selectedTeam}
                  selectedTechnician={selectedTechnician}
                  teamOptions={teamOptions || []}
                  technicianOptions={technicianOptions || []}
                  windowOptions={windowOptions || []}
                  onReserve={onReserve}
                  reserveButtonText={reserveButtonText}
                  reserveButtonDisabled={
                    reserveButtonDisabled || !schedulableSlot
                  }
                  reserveLoading={reserveLoading}
                  reservedSlot={reservedSlot}
                  onCancelReservation={onCancelReservation}
                  cancelButtonText={cancelButtonText}
                  cancelLoading={cancelLoading}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
