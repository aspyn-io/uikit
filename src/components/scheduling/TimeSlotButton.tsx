import React from "react";
import { TimePeriod } from "./types";

/**
 * TimeSlotButton - Renders an individual time slot button in the calendar grid
 * Handles different states: available, selected, reserved, disabled, synthetic
 */
interface TimeSlotButtonProps {
  date: string;
  timePeriod: TimePeriod;
  label: string;
  isAvailable: boolean;
  isSelected: boolean;
  isReserved: boolean;
  hasActiveReservation: boolean;
  isSynthetic?: boolean; // True if this slot is synthetically generated (no real availability)
  onClick: (date: string, timePeriod: TimePeriod) => void;
}

export const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  date,
  timePeriod,
  label,
  isAvailable,
  isSelected,
  isReserved,
  hasActiveReservation,
  isSynthetic = false,
  onClick,
}) => {
  const isDisabled = (hasActiveReservation && !isReserved) || !isAvailable;

  return (
    <button
      onClick={() => !isDisabled && onClick(date, timePeriod)}
      disabled={isDisabled}
      className={`w-full py-3 px-3 text-sm font-medium rounded-lg transition-colors ${
        isReserved
          ? "bg-green-500 text-white cursor-default border-2 border-green-500"
          : isSelected && !hasActiveReservation
            ? "bg-blue-500 text-white cursor-pointer border-2 border-blue-500"
            : isDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700"
              : isSynthetic
                ? "bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border-2 border-amber-200 hover:border-amber-300 cursor-pointer dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950/50 dark:hover:text-amber-300 dark:hover:border-amber-700"
                : "bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-300 cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 dark:hover:border-blue-700"
      }`}
    >
      <span className="flex items-center justify-center gap-1">
        {label}
        {isSynthetic && (
          <span
            className="text-xs"
            title="Limited availability - scheduling may create unassigned appointment"
          >
            *
          </span>
        )}
      </span>
    </button>
  );
};
