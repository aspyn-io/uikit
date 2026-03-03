import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import type { ChatDateMarker } from "./types";

interface ChatCalendarProps {
  /** Dates that have communications */
  dateMarkers: ChatDateMarker[];
  /** Currently selected date */
  selectedDate?: Date | null;
  /** Called when a date is selected */
  onDateSelect: (date: Date) => void;
  /** Called when the month changes (to load new date markers) */
  onMonthChange?: (month: Date) => void;
  /** Whether markers are loading */
  loading?: boolean;
}

/**
 * A compact calendar for navigating to specific dates in the chat.
 * Highlights dates that have communications.
 */
export const ChatCalendar: React.FC<ChatCalendarProps> = ({
  dateMarkers,
  selectedDate,
  onDateSelect,
  onMonthChange,
  loading = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const markerMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const marker of dateMarkers) {
      map.set(marker.date, marker.count);
    }
    return map;
  }, [dateMarkers]);

  const handlePrevMonth = useCallback(() => {
    const prev = subMonths(currentMonth, 1);
    setCurrentMonth(prev);
    onMonthChange?.(prev);
  }, [currentMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    const next = addMonths(currentMonth, 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  }, [currentMonth, onMonthChange]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.map((day, index) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const count = markerMap.get(dayStr) || 0;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              disabled={!isCurrentMonth}
              className={`
                relative w-full aspect-square flex items-center justify-center text-xs rounded-md
                transition-colors duration-100
                ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600 cursor-default" : "cursor-pointer"}
                ${isCurrentMonth && !isSelected ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""}
                ${isSelected ? "bg-blue-500 text-white" : ""}
                ${isDayToday && !isSelected ? "font-bold text-blue-600 dark:text-blue-400" : ""}
                ${isCurrentMonth && !isSelected && !isDayToday ? "text-gray-700 dark:text-gray-300" : ""}
              `}
            >
              {format(day, "d")}
              {/* Dot indicator for dates with communications */}
              {count > 0 && isCurrentMonth && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-blue-500 dark:bg-blue-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default ChatCalendar;
