import { format, isToday, isYesterday, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import type { ChatItem } from "./types";

/**
 * Get the "yyyy-MM-dd" day key for an ISO timestamp in the given timezone.
 * Uses formatInTimeZone to avoid the toZonedTime + startOfDay + format
 * pitfall that produces wrong dates when the browser timezone differs from
 * the target timezone.
 */
export function getDayKey(isoString: string, timezone?: string): string {
  const date = parseISO(isoString);
  if (timezone) {
    return formatInTimeZone(date, timezone, "yyyy-MM-dd");
  }
  return format(date, "yyyy-MM-dd");
}

/**
 * Format a date as a day label for the chat separator.
 * Returns "Today", "Yesterday", or "Mon, Jan 1, 2024"
 */
export function formatDayLabel(isoString: string, timezone?: string): string {
  if (timezone) {
    const date = parseISO(isoString);
    const dateStr = formatInTimeZone(date, timezone, "yyyy-MM-dd");
    const todayStr = formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
    if (dateStr === todayStr) return "Today";
    const yesterday = new Date(Date.now() - 86_400_000);
    const yesterdayStr = formatInTimeZone(yesterday, timezone, "yyyy-MM-dd");
    if (dateStr === yesterdayStr) return "Yesterday";
    return formatInTimeZone(date, timezone, "EEE, MMM d, yyyy");
  }
  const date = parseISO(isoString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEE, MMM d, yyyy");
}

/**
 * Format a timestamp for display on individual messages.
 * Returns "2:30 PM"
 */
export function formatTime(isoString: string, timezone?: string): string {
  const date = parseISO(isoString);
  if (timezone) {
    return formatInTimeZone(date, timezone, "h:mm a");
  }
  return format(date, "h:mm a");
}

/**
 * Format a scheduled timestamp.
 * Returns "Scheduled for Jan 1 at 2:30 PM"
 */
export function formatScheduledTime(
  isoString: string,
  timezone?: string,
): string {
  const date = parseISO(isoString);
  if (timezone) {
    const todayStr = formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
    const dateStr = formatInTimeZone(date, timezone, "yyyy-MM-dd");
    if (dateStr === todayStr) {
      return `Scheduled for today at ${formatInTimeZone(date, timezone, "h:mm a")}`;
    }
    return `Scheduled for ${formatInTimeZone(date, timezone, "MMM d")} at ${formatInTimeZone(date, timezone, "h:mm a")}`;
  }
  if (isToday(date)) return `Scheduled for today at ${format(date, "h:mm a")}`;
  return `Scheduled for ${format(date, "MMM d")} at ${format(date, "h:mm a")}`;
}

/**
 * Group chat items by day.
 * Returns an array of [dayLabel, items[]] tuples, sorted by date ascending.
 */
export function groupItemsByDay(
  items: ChatItem[],
  timezone?: string,
): [string, ChatItem[]][] {
  const groups = new Map<string, ChatItem[]>();

  // Sort items by timestamp ascending (oldest first)
  const sorted = [...items].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  for (const item of sorted) {
    const dayKey = getDayKey(item.timestamp, timezone);

    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }
    groups.get(dayKey)!.push(item);
  }

  // Convert to array of [label, items] tuples
  return Array.from(groups.entries()).map(([, dayItems]) => {
    const label = formatDayLabel(dayItems[0].timestamp, timezone);
    return [label, dayItems];
  });
}

/**
 * Check if two items are on the same day.
 */
export function isSameDayItems(
  a: ChatItem,
  b: ChatItem,
  timezone?: string,
): boolean {
  return getDayKey(a.timestamp, timezone) === getDayKey(b.timestamp, timezone);
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Format a phone number for display (basic formatting).
 * Converts +11234567890 to (123) 456-7890
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    const area = cleaned.slice(1, 4);
    const prefix = cleaned.slice(4, 7);
    const suffix = cleaned.slice(7);
    return `(${area}) ${prefix}-${suffix}`;
  }
  if (cleaned.length === 10) {
    const area = cleaned.slice(0, 3);
    const prefix = cleaned.slice(3, 6);
    const suffix = cleaned.slice(6);
    return `(${area}) ${prefix}-${suffix}`;
  }
  return phone;
}

/**
 * Determine if a contact string looks like a phone number.
 */
export function isPhoneNumber(contact: string): boolean {
  return /^\+?\d{10,15}$/.test(contact.replace(/\D/g, ""));
}

/**
 * Format a contact for display - formats phone numbers, leaves emails as-is.
 */
export function formatContact(contact: string): string {
  if (isPhoneNumber(contact)) return formatPhone(contact);
  return contact;
}
