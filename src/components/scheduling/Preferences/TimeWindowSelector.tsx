import React from "react";
import { Clock } from "lucide-react";
import { parse } from "date-fns";
import { WindowOptionWithAvailability } from "../types";
import { Dropdown, DropdownItem } from "./Dropdown";

interface TimeWindowSelectorProps {
  options: WindowOptionWithAvailability[];
  selectedWindow?: string;
  onWindowChange?: (windowId: string) => void;
  formatDate: (date: Date | string, format: string) => string;
}

/**
 * Formats a time string to a display format using the provided formatDate function
 * Handles both ISO timestamp format (2025-12-14T21:00:00.000Z) and simple time format (HH:mm:ss)
 */
const formatTimeString = (
  timeString: string,
  formatDate: (date: Date | string, format: string) => string
): string => {
  try {
    let time: Date;

    // Check if it's an ISO timestamp format
    if (timeString.includes("T") || timeString.includes("Z")) {
      // Parse ISO timestamp
      time = new Date(timeString);
    } else {
      // Parse simple time string (HH:mm:ss format)
      time = parse(timeString, "HH:mm:ss", new Date());
    }

    // Use the provided formatDate function (which is timezone-aware from useTimezoneFormat hook)
    return formatDate(time, "h:mm a");
  } catch (error) {
    // Fallback to original string if parsing fails
    console.error("Error formatting time:", error);
    return timeString;
  }
};

export const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  options,
  selectedWindow,
  onWindowChange,
  formatDate,
}) => {
  const dropdownItems: DropdownItem[] = options.map((option) => {
    // Format the time window label using the formatDate function (timezone-aware)
    const formattedLabel = `${formatTimeString(
      option.start_time,
      formatDate
    )} - ${formatTimeString(option.end_time, formatDate)}`;

    return {
      id: option.id,
      label: formattedLabel,
      available: option.available,
    };
  });

  return (
    <Dropdown
      label="Preferred Time Window"
      icon={Clock}
      items={dropdownItems}
      selected={selectedWindow}
      onSelect={(id) => onWindowChange?.(id)}
      anyLabel="Any time window"
    />
  );
};
