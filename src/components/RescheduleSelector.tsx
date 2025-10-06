import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Button, Spinner, Datepicker } from "flowbite-react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
  User,
  Minus,
  X,
  Check,
  Globe,
  Star,
} from "lucide-react";
import {
  format,
  addWeeks,
  startOfWeek,
  endOfWeek,
  addDays,
  parseISO,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

// Time period types
export type TimePeriod = "any_time" | "morning" | "afternoon";

export interface TimeSlot {
  start_at: string;
  end_at: string;
  calendar_id: string;
  calendar?: {
    id: string;
    name: string;
  };
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD format
  slots: {
    any_time?: TimeSlot[];
    morning?: TimeSlot[];
    afternoon?: TimeSlot[];
  };
  is_available: boolean;
}

export interface WeekData {
  week_start: string; // YYYY-MM-DD format
  week_end: string; // YYYY-MM-DD format
  days: DayAvailability[];
}

export interface SelectedSlot {
  date: string;
  time_period: TimePeriod;
  slot?: TimeSlot;
}

export interface WindowOption {
  id: string;
  label: string;
  start_time?: string;
  end_time?: string;
  available?: boolean;
}

export interface TeamOption {
  id: string;
  name: string;
  available?: boolean;
}

export interface TechnicianOption {
  id: string;
  name: string;
  rating?: string;
  experience?: string;
  available?: boolean;
  avatar?: string;
}

interface RescheduleSelectorProps {
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
  onCancelReservation?: () => void;

  // Action button
  onReserve?: () => void;
  reserveButtonText?: string;
  reserveButtonDisabled?: boolean;
  reserveLoading?: boolean;

  // UI customization
  showDateJumper?: boolean;
  showTimezoneInfo?: boolean;
  disablePastNavigation?: boolean;
  minDate?: Date;

  // Custom labels
  labels?: {
    anyTime?: string;
    morning?: string;
    afternoon?: string;
    unavailable?: string;
    past?: string;
  };
}

export const RescheduleSelector: React.FC<RescheduleSelectorProps> = ({
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
  onCancelReservation,
  onReserve,
  reserveButtonText = "Reserve Appointment",
  reserveButtonDisabled = false,
  reserveLoading = false,
  showDateJumper = true,
  showTimezoneInfo = true,
  disablePastNavigation = true,
  minDate,
  labels = {},
}) => {
  // Refs for dropdown management
  const datepickerRef = useRef<HTMLDivElement>(null);
  const timeWindowRef = useRef<HTMLDivElement>(null);
  const technicianRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showTimeWindowDropdown, setShowTimeWindowDropdown] = useState(false);
  const [showTechnicianDropdown, setShowTechnicianDropdown] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Current week being displayed
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    if (weekData?.week_start) {
      return parseISO(weekData.week_start);
    }
    return startOfWeek(new Date(), { weekStartsOn: 0 });
  });

  // Default labels
  const timePeriodLabels = {
    any_time: labels.anyTime || "Any time",
    morning: labels.morning || "Morning",
    afternoon: labels.afternoon || "Afternoon",
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datepickerRef.current &&
        !datepickerRef.current.contains(event.target as Node)
      ) {
        setShowDatepicker(false);
      }
      if (
        timeWindowRef.current &&
        !timeWindowRef.current.contains(event.target as Node)
      ) {
        setShowTimeWindowDropdown(false);
      }
      if (
        technicianRef.current &&
        !technicianRef.current.contains(event.target as Node)
      ) {
        setShowTechnicianDropdown(false);
      }
      if (teamRef.current && !teamRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
    };

    if (
      showDatepicker ||
      showTimeWindowDropdown ||
      showTechnicianDropdown ||
      showTeamDropdown
    ) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [
    showDatepicker,
    showTimeWindowDropdown,
    showTechnicianDropdown,
    showTeamDropdown,
  ]);

  // Reset advanced options when slot changes
  useEffect(() => {
    if (selectedSlot) {
      setShowTimeWindowDropdown(false);
      setShowTechnicianDropdown(false);
      setShowTeamDropdown(false);
    }
  }, [selectedSlot?.date, selectedSlot?.time_period]);

  // Format date with timezone support
  const formatDate = useCallback(
    (date: Date | string, formatStr: string) => {
      const dateObj = typeof date === "string" ? parseISO(date) : date;
      if (timezone) {
        return formatInTimeZone(dateObj, timezone, formatStr);
      }
      return format(dateObj, formatStr);
    },
    [timezone]
  );

  // Get timezone display
  const getTimezoneDisplay = useMemo(() => {
    if (timezoneDisplay) return timezoneDisplay;

    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
      });
      const parts = formatter.formatToParts(now);
      const timeZoneName =
        parts.find((part) => part.type === "timeZoneName")?.value || "EST";
      return timeZoneName;
    } catch {
      return "EST (UTC-5)";
    }
  }, [timezone, timezoneDisplay]);

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

  // Get availability for a specific date
  const getAvailabilityForDate = useCallback(
    (dateString: string) => {
      if (!weekData?.days) return null;
      return weekData.days.find((day) => day.date === dateString);
    },
    [weekData]
  );

  // Check if date is in the past
  const isDateInPast = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }, []);

  // Check if a time slot is available
  const isTimeSlotAvailable = useCallback(
    (dateString: string, timePeriod: TimePeriod): boolean => {
      const dayData = getAvailabilityForDate(dateString);
      if (!dayData || !dayData.is_available) return false;

      const slots = dayData.slots[timePeriod];
      return slots !== undefined && slots.length > 0;
    },
    [getAvailabilityForDate]
  );

  // Format week range
  const formatWeekRange = useCallback(() => {
    const startDate = weekDates[0];
    const endDate = weekDates[6];
    const startFormatted = formatDate(startDate, "MMM d, yyyy");
    const endFormatted = formatDate(endDate, "MMM d, yyyy");
    return `${startFormatted} - ${endFormatted}`;
  }, [weekDates, formatDate]);

  // Navigation handlers
  const canNavigateToPrevWeek = useCallback(() => {
    if (reservedSlot) return false;
    if (!disablePastNavigation) return true;

    const prevWeek = addWeeks(currentWeekStart, -1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const prevWeekEnd = endOfWeek(prevWeek, { weekStartsOn: 0 });

    return prevWeekEnd >= today;
  }, [currentWeekStart, reservedSlot, disablePastNavigation]);

  const handlePrevWeek = useCallback(() => {
    if (!canNavigateToPrevWeek()) return;

    const newWeekStart = addWeeks(currentWeekStart, -1);
    const newWeekEnd = endOfWeek(newWeekStart, { weekStartsOn: 0 });
    setCurrentWeekStart(newWeekStart);
    onSlotSelect(null);
    onWeekChange(
      format(newWeekStart, "yyyy-MM-dd"),
      format(newWeekEnd, "yyyy-MM-dd")
    );
  }, [currentWeekStart, onWeekChange, onSlotSelect, canNavigateToPrevWeek]);

  const handleNextWeek = useCallback(() => {
    if (reservedSlot) return;

    const newWeekStart = addWeeks(currentWeekStart, 1);
    const newWeekEnd = endOfWeek(newWeekStart, { weekStartsOn: 0 });
    setCurrentWeekStart(newWeekStart);
    onSlotSelect(null);
    onWeekChange(
      format(newWeekStart, "yyyy-MM-dd"),
      format(newWeekEnd, "yyyy-MM-dd")
    );
  }, [currentWeekStart, onWeekChange, onSlotSelect, reservedSlot]);

  // Handle date jump
  const handleDateJump = useCallback(
    (selectedDate: Date | null) => {
      if (!selectedDate) return;

      const dayOfWeek = selectedDate.getDay();
      const sunday = new Date(selectedDate);
      sunday.setDate(selectedDate.getDate() - dayOfWeek);

      const newWeekEnd = endOfWeek(sunday, { weekStartsOn: 0 });
      setCurrentWeekStart(sunday);
      onSlotSelect(null);
      setShowDatepicker(false);
      onWeekChange(
        format(sunday, "yyyy-MM-dd"),
        format(newWeekEnd, "yyyy-MM-dd")
      );
    },
    [onWeekChange, onSlotSelect]
  );

  // Handle slot selection
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

  // Check if a slot is selected
  const isSlotSelected = useCallback(
    (date: string, timePeriod: TimePeriod) => {
      if (!selectedSlot) return false;
      return (
        selectedSlot.date === date && selectedSlot.time_period === timePeriod
      );
    },
    [selectedSlot]
  );

  // Check if a slot is reserved
  const isSlotReserved = useCallback(
    (date: string, timePeriod: TimePeriod) => {
      if (!reservedSlot) return false;
      return (
        reservedSlot.date === date && reservedSlot.time_period === timePeriod
      );
    },
    [reservedSlot]
  );

  // Render time period button
  const renderTimePeriodButton = useCallback(
    (date: Date, dateString: string, timePeriod: TimePeriod, label: string) => {
      const dayData = getAvailabilityForDate(dateString);
      const isAvailable = isTimeSlotAvailable(dateString, timePeriod);
      const isSelected = isSlotSelected(dateString, timePeriod);
      const isReserved = isSlotReserved(dateString, timePeriod);
      const hasActiveReservation = !!reservedSlot;
      const isDisabled = (hasActiveReservation && !isReserved) || !isAvailable;

      const slot = dayData?.slots[timePeriod]?.[0];

      return (
        <button
          key={timePeriod}
          onClick={() =>
            !isDisabled && handleSlotClick(dateString, timePeriod, slot)
          }
          disabled={isDisabled}
          className={`w-full py-3 px-3 text-sm font-medium rounded-lg transition-colors ${
            isReserved
              ? "bg-green-500 text-white cursor-default border-2 border-green-500"
              : isSelected && !hasActiveReservation
              ? "bg-blue-500 text-white cursor-pointer border-2 border-blue-500"
              : isDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
              : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300 cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 dark:hover:border-blue-700"
          }`}
        >
          {!isAvailable && timePeriod !== "any_time" ? `${label} (N/A)` : label}
        </button>
      );
    },
    [
      getAvailabilityForDate,
      isTimeSlotAvailable,
      isSlotSelected,
      isSlotReserved,
      reservedSlot,
      handleSlotClick,
    ]
  );

  // Get available windows for selected slot
  const getAvailableWindows = useMemo(() => {
    if (!selectedSlot || !windowOptions.length) return [];

    return windowOptions.map((option) => ({
      ...option,
      available: option.available !== false,
    }));
  }, [selectedSlot, windowOptions]);

  // Get available teams for selected slot
  const getAvailableTeams = useMemo(() => {
    if (!selectedSlot || !teamOptions.length) return [];

    return teamOptions.map((option) => ({
      ...option,
      available: option.available !== false,
    }));
  }, [selectedSlot, teamOptions]);

  // Get available technicians for selected slot
  const getAvailableTechnicians = useMemo(() => {
    if (!selectedSlot || !technicianOptions.length) return [];

    return technicianOptions.map((option) => ({
      ...option,
      available: option.available !== false,
    }));
  }, [selectedSlot, technicianOptions]);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevWeek}
            disabled={!canNavigateToPrevWeek()}
            className={`p-2 rounded-lg transition-colors ${
              !canNavigateToPrevWeek()
                ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatWeekRange()}
              </h3>

              {/* Date Jumper */}
              {showDateJumper && (
                <div className="relative" ref={datepickerRef}>
                  <Button
                    size="xs"
                    color="gray"
                    onClick={() => setShowDatepicker(!showDatepicker)}
                    className="p-1.5"
                    disabled={!!reservedSlot}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>

                  {showDatepicker && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <Datepicker
                        inline
                        minDate={minDate || new Date()}
                        autoHide={false}
                        onChange={handleDateJump}
                        weekStart={0}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Timezone Info */}
              {showTimezoneInfo && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Globe className="h-3 w-3" />
                  <span>@ {getTimezoneDisplay}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNextWeek}
            disabled={!!reservedSlot}
            className={`p-2 rounded-lg transition-colors ${
              reservedSlot
                ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
            aria-label="Next week"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-3">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (dayName) => (
                <div key={dayName} className="text-center py-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {dayName}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-7 gap-1 mt-2">
              {weekDates.map((date) => {
                const dateString = format(date, "yyyy-MM-dd");
                const isToday =
                  format(date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

                return (
                  <div
                    key={dateString}
                    className={`border rounded-lg p-2 bg-white dark:bg-gray-800 ${
                      isToday
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {/* Date Header Skeleton */}
                    <div className="text-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="mx-auto h-7 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>

                    {/* Time Period Buttons Skeleton */}
                    <div className="space-y-2">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Week Grid */
            <div className="grid grid-cols-7 gap-1 mt-2">
              {weekDates.map((date) => {
                const dateString = format(date, "yyyy-MM-dd");
                const dayData = getAvailabilityForDate(dateString);
                const isPast = isDateInPast(date);
                const isToday =
                  format(date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

                return (
                  <div
                    key={dateString}
                    className={`border rounded-lg p-2 ${
                      isPast
                        ? "bg-gray-50 dark:bg-gray-800/50"
                        : "bg-white dark:bg-gray-800"
                    } ${
                      isToday
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {/* Date Header */}
                    <div className="text-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <div
                        className={`text-lg font-bold ${
                          isToday
                            ? "text-blue-600 dark:text-blue-400"
                            : isPast
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {format(date, "d")}
                      </div>
                    </div>

                    {/* Time Period Buttons */}
                    <div className="space-y-2">
                      {isPast || !dayData?.is_available ? (
                        <div className="flex flex-col items-center justify-center py-6 text-sm text-gray-400 dark:text-gray-600">
                          <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-2 mb-2">
                            <Minus className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          </div>
                          <span>{isPast ? "Past" : "Unavailable"}</span>
                        </div>
                      ) : (
                        <>
                          {renderTimePeriodButton(
                            date,
                            dateString,
                            "any_time",
                            timePeriodLabels.any_time
                          )}
                          {renderTimePeriodButton(
                            date,
                            dateString,
                            "morning",
                            timePeriodLabels.morning
                          )}
                          {renderTimePeriodButton(
                            date,
                            dateString,
                            "afternoon",
                            timePeriodLabels.afternoon
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      {selectedSlot && (
        <div className="space-y-4">
          {/* Preferences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Window Selector */}
            {windowOptions.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Time Window
                  </label>
                </div>
                <div className="relative" ref={timeWindowRef}>
                  <button
                    onClick={() =>
                      setShowTimeWindowDropdown(!showTimeWindowDropdown)
                    }
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>
                      {selectedWindow
                        ? windowOptions.find((w) => w.id === selectedWindow)
                            ?.label || "Select a time window"
                        : "Select a time window"}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        showTimeWindowDropdown ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showTimeWindowDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <button
                        onClick={() => {
                          onWindowChange?.("");
                          setShowTimeWindowDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                          !selectedWindow
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>No preference</span>
                        {!selectedWindow && <Check className="h-4 w-4" />}
                      </button>
                      {getAvailableWindows.map((window, index) => (
                        <button
                          key={window.id}
                          onClick={() => {
                            onWindowChange?.(window.id);
                            setShowTimeWindowDropdown(false);
                          }}
                          disabled={!window.available}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                            index < getAvailableWindows.length - 1
                              ? "border-b border-gray-100 dark:border-gray-700"
                              : ""
                          } ${
                            selectedWindow === window.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          } ${
                            !window.available
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span>{window.label}</span>
                          {selectedWindow === window.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Selector */}
            {teamOptions.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Team
                  </label>
                </div>
                <div className="relative" ref={teamRef}>
                  <button
                    onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>
                      {selectedTeam
                        ? teamOptions.find((t) => t.id === selectedTeam)
                            ?.name || "Any team"
                        : "Any team"}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        showTeamDropdown ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showTeamDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <button
                        onClick={() => {
                          onTeamChange?.("");
                          setShowTeamDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                          !selectedTeam
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>Any team</span>
                        {!selectedTeam && <Check className="h-4 w-4" />}
                      </button>
                      {getAvailableTeams.map((team, index) => (
                        <button
                          key={team.id}
                          onClick={() => {
                            onTeamChange?.(team.id);
                            setShowTeamDropdown(false);
                          }}
                          disabled={!team.available}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                            index < getAvailableTeams.length - 1
                              ? "border-b border-gray-100 dark:border-gray-700"
                              : ""
                          } ${
                            selectedTeam === team.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          } ${
                            !team.available
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span>{team.name}</span>
                          {selectedTeam === team.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technician Selector */}
            {technicianOptions.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Technician
                  </label>
                </div>
                <div className="relative" ref={technicianRef}>
                  <button
                    onClick={() =>
                      setShowTechnicianDropdown(!showTechnicianDropdown)
                    }
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>
                      {selectedTechnician
                        ? technicianOptions.find(
                            (t) => t.id === selectedTechnician
                          )?.name || "Any technician"
                        : "Any technician"}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        showTechnicianDropdown ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showTechnicianDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                      <button
                        onClick={() => {
                          onTechnicianChange?.("");
                          setShowTechnicianDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 ${
                          !selectedTechnician
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>Any technician</span>
                        {!selectedTechnician && <Check className="h-4 w-4" />}
                      </button>
                      {getAvailableTechnicians.map((technician, index) => (
                        <button
                          key={technician.id}
                          onClick={() => {
                            onTechnicianChange?.(technician.id);
                            setShowTechnicianDropdown(false);
                          }}
                          disabled={!technician.available}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            index < getAvailableTechnicians.length - 1
                              ? "border-b border-gray-100 dark:border-gray-700"
                              : ""
                          } ${
                            selectedTechnician === technician.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          } ${
                            !technician.available
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {technician.avatar && (
                                <img
                                  src={technician.avatar}
                                  alt={technician.name}
                                  className="h-6 w-6 rounded-full"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {technician.name}
                                </div>
                                {(technician.rating ||
                                  technician.experience) && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    {technician.rating && (
                                      <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {technician.rating}
                                      </span>
                                    )}
                                    {technician.experience && (
                                      <span>{technician.experience}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {selectedTechnician === technician.id && (
                              <Check className="h-4 w-4" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selected Appointment Card */}
          <div className="shadow-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg text-blue-900 dark:text-blue-500">
                  Selected Appointment
                </h4>
                <p className="text-blue-700 dark:text-blue-400">
                  {formatDate(parseISO(selectedSlot.date), "MMM d, yyyy")}
                  {" - "}
                  {selectedSlot.time_period.charAt(0).toUpperCase() +
                    selectedSlot.time_period.slice(1).replace("_", " ")}
                </p>
                <div className="mt-2 text-blue-600 dark:text-blue-400">
                  <p className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      Window:{" "}
                      {selectedWindow
                        ? windowOptions.find((w) => w.id === selectedWindow)
                            ?.label
                        : "None"}
                    </span>
                    <span>•</span>
                    <Users className="h-3 w-3" />
                    <span>
                      Team:{" "}
                      {selectedTeam
                        ? teamOptions.find((t) => t.id === selectedTeam)?.name
                        : "None"}
                    </span>
                    <span>•</span>
                    <User className="h-3 w-3" />
                    <span>
                      Technician:{" "}
                      {selectedTechnician
                        ? technicianOptions.find(
                            (t) => t.id === selectedTechnician
                          )?.name
                        : "None"}
                    </span>
                  </p>
                </div>
              </div>
              {onReserve && (
                <div className="flex items-center">
                  <Button
                    size="md"
                    onClick={onReserve}
                    disabled={
                      reserveButtonDisabled || !!reservedSlot || reserveLoading
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {reserveLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Processing...</span>
                      </div>
                    ) : reservedSlot ? (
                      "Appointment Reserved"
                    ) : (
                      reserveButtonText
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
