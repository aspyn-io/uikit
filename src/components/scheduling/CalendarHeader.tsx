import React, { useState, useRef } from "react";
import { Button, Datepicker } from "flowbite-react";
import { ChevronLeft, ChevronRight, Calendar, Globe } from "lucide-react";
import { useOutsideClick } from "./hooks/useOutsideClick";

interface CalendarHeaderProps {
  weekRange: string;
  canNavigatePrev: boolean;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDateJump?: (date: Date) => void;
  showDateJumper?: boolean;
  showTimezoneInfo?: boolean;
  timezoneDisplay?: string;
  minDate?: Date;
  isReserved?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  weekRange,
  canNavigatePrev,
  onPrevWeek,
  onNextWeek,
  onDateJump,
  showDateJumper = true,
  showTimezoneInfo = true,
  timezoneDisplay,
  minDate,
  isReserved = false,
}) => {
  const [showDatepicker, setShowDatepicker] = useState(false);
  const datepickerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    datepickerRef,
    () => setShowDatepicker(false),
    showDatepicker
  );

  const handleDateJump = (selectedDate: Date | null) => {
    if (!selectedDate || !onDateJump) return;
    onDateJump(selectedDate);
    setShowDatepicker(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onPrevWeek}
        disabled={!canNavigatePrev}
        className={`p-2 rounded-lg transition-colors ${
          !canNavigatePrev
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
            {weekRange}
          </h3>

          {/* Date Jumper */}
          {showDateJumper && onDateJump && (
            <div className="relative" ref={datepickerRef}>
              <Button
                size="xs"
                color="light"
                onClick={() => setShowDatepicker(!showDatepicker)}
                className="p-1.5"
                disabled={isReserved}
              >
                <Calendar className="h-4 w-4" />
              </Button>

              {showDatepicker && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                  <Datepicker
                    inline
                    minDate={minDate || new Date()}
                    autoHide={false}
                    onChange={handleDateJump}
                    weekStart={0}
                    showTodayButton={true}
                    showClearButton={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Timezone Info */}
          {showTimezoneInfo && timezoneDisplay && (
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="h-3 w-3" />
              <span>{timezoneDisplay}</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onNextWeek}
        disabled={isReserved}
        className={`p-2 rounded-lg transition-colors ${
          isReserved
            ? "text-gray-300 cursor-not-allowed dark:text-gray-600"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        }`}
        aria-label="Next week"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
