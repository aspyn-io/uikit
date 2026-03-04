import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
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
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? startOfMonth(selectedDate) : new Date(),
  );

  const markerMap = useMemo(() => {
    const map = new Map<string, { count: number; queuedCount: number }>();
    for (const marker of dateMarkers) {
      map.set(marker.date, {
        count: marker.count,
        queuedCount: marker.queuedCount ?? 0,
      });
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

  // Build calendar grid using Date constructor arithmetic to avoid DST edge cases.
  // The while-loop + addDays approach can produce duplicate rows when DST
  // springs forward (e.g. America/Denver in March).
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart);
    const monthEnd = endOfMonth(monthStart);
    const y = gridStart.getFullYear();
    const m = gridStart.getMonth();
    const d = gridStart.getDate();

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(y, m, d + i));
    }

    // Trim trailing week(s) that contain no days from the target month
    const monthNum = monthStart.getMonth();
    while (days.length > 7) {
      const lastWeek = days.slice(-7);
      if (lastWeek.every((day) => day.getMonth() !== monthNum)) {
        days.splice(-7);
      } else {
        break;
      }
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
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const marker = markerMap.get(dayStr);
          const sentCount = marker?.count ?? 0;
          const qCount = marker?.queuedCount ?? 0;
          const hasSent = sentCount > 0;
          const hasQueued = qCount > 0;
          const hasContent = hasSent || hasQueued;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDayToday = isToday(day);

          // Determine background and text classes
          let bgClass = "";
          let textClass = "";

          if (!isCurrentMonth) {
            textClass = "text-gray-300 dark:text-gray-600";
          } else if (isSelected) {
            bgClass = "bg-blue-500";
            textClass = "text-white";
          } else if (hasSent) {
            bgClass = "bg-blue-50 dark:bg-blue-900/20";
            textClass = isDayToday
              ? "font-bold text-blue-700 dark:text-blue-300"
              : "text-blue-700 dark:text-blue-300";
          } else if (hasQueued) {
            bgClass = "bg-amber-50 dark:bg-amber-900/20";
            textClass = isDayToday
              ? "font-bold text-amber-700 dark:text-amber-400"
              : "text-amber-700 dark:text-amber-400";
          } else if (isDayToday) {
            textClass = "font-bold text-blue-600 dark:text-blue-400";
          } else {
            textClass = "text-gray-700 dark:text-gray-300";
          }

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              disabled={!isCurrentMonth}
              className={`
                relative w-full h-8 flex items-center justify-center text-xs rounded-md
                transition-colors duration-100
                ${!isCurrentMonth ? "cursor-default" : "cursor-pointer"}
                ${isCurrentMonth && !isSelected ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""}
                ${bgClass}
                ${textClass}
                ${isDayToday && !isSelected ? "ring-1 ring-inset ring-blue-400 dark:ring-blue-500" : ""}
              `}
            >
              {format(day, "d")}
              {/* Dot indicators for dates with communications */}
              {hasContent && isCurrentMonth && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
                  {hasSent && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? "bg-white" : "bg-blue-500 dark:bg-blue-400"
                      }`}
                    />
                  )}
                  {hasQueued && (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected
                          ? "bg-amber-200"
                          : "bg-amber-500 dark:bg-amber-400"
                      }`}
                    />
                  )}
                </span>
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
