import React, { useCallback } from "react";
import { format } from "date-fns";
import { Minus } from "lucide-react";
import { TimeSlotButton } from "./TimeSlotButton";
import {
  DayAvailability,
  SelectedSlot,
  TimePeriod,
  TimeSlot,
  Labels,
} from "./types";

interface WeekGridProps {
  weekDates: Date[];
  loading: boolean;
  getAvailabilityForDate: (dateString: string) => DayAvailability | null;
  isDateInPast: (date: Date) => boolean;
  selectedSlot: SelectedSlot | null;
  reservedSlot: SelectedSlot | null;
  onSlotClick: (date: string, timePeriod: TimePeriod, slot?: TimeSlot) => void;
  labels: Labels;
}

export const WeekGrid: React.FC<WeekGridProps> = ({
  weekDates,
  loading,
  getAvailabilityForDate,
  isDateInPast,
  selectedSlot,
  reservedSlot,
  onSlotClick,
  labels,
}) => {
  const timePeriodLabels = {
    any_time: labels.anyTime || "Any time",
    morning: labels.morning || "Morning",
    afternoon: labels.afternoon || "Afternoon",
  };

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

      const slot = dayData?.slots[timePeriod]?.[0];

      return (
        <TimeSlotButton
          key={timePeriod}
          date={dateString}
          timePeriod={timePeriod}
          label={label}
          isAvailable={isAvailable}
          isSelected={isSelected}
          isReserved={isReserved}
          hasActiveReservation={hasActiveReservation}
          slot={slot}
          onClick={onSlotClick}
        />
      );
    },
    [
      getAvailabilityForDate,
      isTimeSlotAvailable,
      isSlotSelected,
      isSlotReserved,
      reservedSlot,
      onSlotClick,
    ]
  );

  return (
    <div className="p-3">
      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="text-center py-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {dayName}
            </span>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-7 gap-1 mt-2">
          {weekDates.map((date) => {
            const dateString = format(date, "yyyy-MM-dd");

            return (
              <div key={dateString} className="p-2 bg-white dark:bg-gray-800">
                {/* Date Header Skeleton */}
                <div className="text-center mb-2 pb-2">
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
              format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            return (
              <div key={dateString} className="p-1">
                {/* Date Header */}
                <div className="text-center pb-2">
                  <div
                    className={`text-lg font-bold py-1 rounded-lg ${
                      isToday
                        ? "bg-blue-200 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
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
  );
};
