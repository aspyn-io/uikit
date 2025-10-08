import { useCallback, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/**
 * Hook for timezone-aware date formatting
 */
export const useTimezoneFormat = (
  timezone: string = "America/New_York",
  timezoneDisplay?: string
) => {
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

  return { formatDate, getTimezoneDisplay };
};
